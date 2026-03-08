import React from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  disabled: boolean;
}

const controls = [
  { event: 'volume-down', label: '🔉', title: 'Vol –' },
  { event: 'play-pause',  label: '⏯',  title: 'Play / Pause' },
  { event: 'volume-up',   label: '🔊', title: 'Vol +' },
];

export const MediaControls: React.FC<Props> = ({ socket, disabled }) => (
  <div>
    <h2 className="section-title">Media</h2>
    <div className="grid grid-cols-3 gap-3">
      {controls.map(({ event, label, title }) => (
        <button
          key={event}
          onPointerDown={() => socket?.emit(event)}
          disabled={disabled}
          title={title}
          className="btn btn-secondary h-16 text-2xl"
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);
