import React, { useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  disabled: boolean;
}

export const ScrollControls: React.FC<Props> = ({ socket, disabled }) => {
  // Hold-to-scroll: fires repeatedly while button is held
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScroll = useCallback((event: 'scroll-up' | 'scroll-down') => {
    if (disabled) return;
    socket?.emit(event);
    intervalRef.current = setInterval(() => socket?.emit(event), 120);
  }, [socket, disabled]);

  const stopScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const btnClass = `btn btn-secondary h-16 text-2xl select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <div>
      <h2 className="section-title">Scroll</h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={disabled}
          onPointerDown={() => startScroll('scroll-up')}
          onPointerUp={stopScroll}
          onPointerLeave={stopScroll}
          onPointerCancel={stopScroll}
          className={btnClass}
          title="Scroll Up"
        >
          ▲ Up
        </button>
        <button
          disabled={disabled}
          onPointerDown={() => startScroll('scroll-down')}
          onPointerUp={stopScroll}
          onPointerLeave={stopScroll}
          onPointerCancel={stopScroll}
          className={btnClass}
          title="Scroll Down"
        >
          ▼ Down
        </button>
      </div>
    </div>
  );
};
