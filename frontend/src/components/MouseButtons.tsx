import React from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  disabled: boolean;
}

export const MouseButtons: React.FC<Props> = ({ socket, disabled }) => {
  const emit = (event: string) => socket?.emit(event);

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onPointerDown={() => emit('left-click')}
        disabled={disabled}
        className="btn btn-primary h-16 text-base tracking-wide"
      >
        Left Click
      </button>
      <button
        onPointerDown={() => emit('right-click')}
        disabled={disabled}
        className="btn btn-secondary h-16 text-base tracking-wide"
      >
        Right Click
      </button>
    </div>
  );
};
