import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { randomBytes } from 'crypto';
import path from 'path';
import fs from 'fs';
import { registerSocketHandlers } from './socketHandlers';
import { createFileRouter } from './storage/fileRoutes';

const app = express();
const httpServer = createServer(app);

// ── Local network CIDR ranges ──────────────────────────────────────────────
const LOCAL_RANGES = [
  /^127\./,
  /^192\.168\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^::1$/,
  /^fc00:/,
  /^fd/,
];

function isLocalIP(ip: string): boolean {
  const cleaned = ip.replace(/^::ffff:/, '');
  return LOCAL_RANGES.some((re) => re.test(cleaned));
}

// ── Session token store (in-memory for Phase 1) ────────────────────────────
const validTokens = new Set<string>();

export function generateSessionToken(): string {
  const token = randomBytes(24).toString('hex');
  validTokens.add(token);
  return token;
}

// ── Express middleware ─────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// Serve session token to local clients only
app.get('/api/token', (req, res) => {
  const clientIP = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim()
    ?? req.socket.remoteAddress
    ?? '';

  if (!isLocalIP(clientIP)) {
    res.status(403).json({ error: 'Forbidden: non-local IP' });
    return;
  }

  const token = generateSessionToken();
  res.json({ token });
});

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Socket.IO ──────────────────────────────────────────────────────────────
export const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

io.use((socket: Socket, next) => {
  const clientIP = socket.handshake.address ?? '';
  if (!isLocalIP(clientIP)) {
    return next(new Error('Forbidden: non-local IP'));
  }

  const token = socket.handshake.auth?.token as string | undefined;
  if (!token || !validTokens.has(token)) {
    return next(new Error('Unauthorized: invalid session token'));
  }

  next();
});

io.on('connection', (socket: Socket) => {
  const ip = socket.handshake.address;
  console.log(`[+] Client connected: ${socket.id} from ${ip}`);

  registerSocketHandlers(socket);

  socket.on('disconnect', () => {
    console.log(`[-] Client disconnected: ${socket.id}`);
  });
});

// ── File sharing routes (mounted after io is created) ─────────────────────
app.use('/api', createFileRouter(io));

// ── Serve frontend static build (production) ──────────────────────────────
const publicPath = path.join(__dirname, '../../public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  // SPA fallback — all non-API routes return index.html
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// ── Start server ───────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 3001);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🖥  Remote Control Server running on http://0.0.0.0:${PORT}`);
  console.log(`   Token endpoint: http://<your-local-ip>:${PORT}/api/token\n`);
});
