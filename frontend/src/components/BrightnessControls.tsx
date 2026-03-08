import React from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  disabled: boolean;
}

export const BrightnessControls: React.FC<Props> = ({ socket, disabled }) => (
  <div>
    <h2 className="section-title">Brightness</h2>
    <div className="grid grid-cols-2 gap-3">
      <button
        disabled={disabled}
        onPointerDown={() => socket?.emit('brightness-up')}
        className="btn btn-secondary h-14 text-xl"
        title="Brightness Up"
      >
        ☀️ +
      </button>
      <button
        disabled={disabled}
        onPointerDown={() => socket?.emit('brightness-down')}
        className="btn btn-secondary h-14 text-xl"
        title="Brightness Down"
      >
        🔅 –
      </button>
    </div>
  </div>
);
