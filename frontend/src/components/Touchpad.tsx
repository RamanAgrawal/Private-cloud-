import React, { useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  disabled: boolean;
}

const SENSITIVITY = 1.5;

export const Touchpad: React.FC<Props> = ({ socket, disabled }) => {
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);

  // ── Pointer events (mouse + touch unified) ───────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    lastPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = true;
  }, [disabled]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !lastPos.current || disabled) return;

    const dx = Math.round((e.clientX - lastPos.current.x) * SENSITIVITY);
    const dy = Math.round((e.clientY - lastPos.current.y) * SENSITIVITY);

    if (dx !== 0 || dy !== 0) {
      socket?.emit('mouse-move', { dx, dy });
    }

    lastPos.current = { x: e.clientX, y: e.clientY };
  }, [socket, disabled]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    lastPos.current = null;
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="section-title">Touchpad</h2>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`
          relative w-full rounded-xl border-2
          ${disabled
            ? 'border-surface-border bg-surface-card cursor-not-allowed opacity-50'
            : 'border-accent/40 bg-surface-card/60 cursor-crosshair active:border-accent'}
          select-none touch-none
        `}
        style={{ height: '200px' }}
      >
        {disabled ? (
          <span className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm select-none">
            Not connected
          </span>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs select-none pointer-events-none">
            Drag to move mouse
          </span>
        )}
      </div>
    </div>
  );
};
