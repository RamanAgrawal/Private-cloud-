import { io, Socket } from 'socket.io-client';

// Derive server URL from the page origin (same host, port 3001)
const SERVER_URL = `${window.location.protocol}//${window.location.hostname}:3001`;

let socket: Socket | null = null;

export async function createSocket(): Promise<Socket> {
  // Fetch a session token from the backend
  const res = await fetch(`${SERVER_URL}/api/token`);
  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  const { token } = (await res.json()) as { token: string };

  socket = io(SERVER_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}
