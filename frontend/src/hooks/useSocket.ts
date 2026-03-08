import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from '../socket/socketClient';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface UseSocketReturn {
  socket: Socket | null;
  status: ConnectionStatus;
  error: string | null;
}

export function useSocket(): UseSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const s = await createSocket();
        if (cancelled) { s.disconnect(); return; }

        socketRef.current = s;

        s.on('connect', () => {
          if (!cancelled) setStatus('connected');
        });

        s.on('disconnect', () => {
          if (!cancelled) setStatus('disconnected');
        });

        s.on('connect_error', (err: Error) => {
          if (!cancelled) {
            setStatus('error');
            setError(err.message);
          }
        });
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    })();

    return () => {
      cancelled = true;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { socket: socketRef.current, status, error };
}
