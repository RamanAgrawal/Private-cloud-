import { Router, Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import fs from 'fs-extra';
import { upload, isValidStoredFilename } from './uploadHandler';
import { writeMeta, listFiles, deleteFile, resolveFilePath } from './fileController';

// ── Local-network guard (reuses same logic as server.ts) ───────────────────
const LOCAL_RANGES = [
  /^127\./,
  /^192\.168\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^::1$/,
  /^fc00:/,
  /^fd/,
];

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string | undefined;
  return (forwarded?.split(',')[0].trim() ?? req.socket.remoteAddress ?? '').replace(/^::ffff:/, '');
}

function localOnly(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIP(req);
  if (!LOCAL_RANGES.some((re) => re.test(ip))) {
    res.status(403).json({ error: 'Forbidden: non-local IP' });
    return;
  }
  next();
}

// ── Router factory (receives the shared Socket.IO server) ──────────────────
export function createFileRouter(io: Server): Router {
  const router = Router();

  router.use(localOnly);

  // POST /api/upload ─────────────────────────────────────────────────────────
  router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    try {
      await writeMeta(req.file.filename, {
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
      });

      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        uploadedAt: new Date().toISOString(),
        mimetype: req.file.mimetype,
      };

      io.emit('file-uploaded', fileInfo);
      res.status(201).json(fileInfo);
    } catch (err) {
      console.error('[upload]', err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // GET /api/files ───────────────────────────────────────────────────────────
  router.get('/files', async (_req: Request, res: Response) => {
    try {
      const result = await listFiles();
      res.json(result);
    } catch (err) {
      console.error('[files]', err);
      res.status(500).json({ error: 'Could not list files' });
    }
  });

  // GET /api/download/:filename ──────────────────────────────────────────────
  router.get('/download/:filename', async (req: Request, res: Response) => {
    const { filename } = req.params;

    if (!isValidStoredFilename(filename)) {
      res.status(400).json({ error: 'Invalid filename' });
      return;
    }

    const filePath = resolveFilePath(filename);

    if (!(await fs.pathExists(filePath))) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    res.download(filePath, filename.replace(/^\d+_/, ''));
  });

  // DELETE /api/file/:filename ───────────────────────────────────────────────
  router.delete('/file/:filename', async (req: Request, res: Response) => {
    const { filename } = req.params;

    if (!isValidStoredFilename(filename)) {
      res.status(400).json({ error: 'Invalid filename' });
      return;
    }

    const filePath = resolveFilePath(filename);

    if (!(await fs.pathExists(filePath))) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    try {
      await deleteFile(filename);
      io.emit('file-deleted', { filename });
      res.json({ success: true });
    } catch (err) {
      console.error('[delete]', err);
      res.status(500).json({ error: 'Delete failed' });
    }
  });

  return router;
}
