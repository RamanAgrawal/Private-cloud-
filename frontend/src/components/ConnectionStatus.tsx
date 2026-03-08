import React from 'react';
import { ConnectionStatus as Status } from '../hooks/useSocket';

interface Props {
  status: Status;
  error: string | null;
}

const badge: Record<Status, { dot: string; label: string; text: string }> = {
  connecting:   { dot: 'bg-yellow-400 animate-pulse', label: 'Connecting…',   text: 'text-yellow-400' },
  connected:    { dot: 'bg-success',                  label: 'Connected',     text: 'text-success' },
  disconnected: { dot: 'bg-gray-500',                 label: 'Disconnected',  text: 'text-gray-400' },
  error:        { dot: 'bg-danger',                   label: 'Error',         text: 'text-danger' },
};

export const ConnectionStatus: React.FC<Props> = ({ status, error }) => {
  const b = badge[status];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${b.dot}`} />
        <span className={`text-sm font-mono font-semibold tracking-wide ${b.text}`}>{b.label}</span>
      </div>
      {error && (
        <p className="text-xs text-danger/80 max-w-xs text-center">{error}</p>
      )}
    </div>
  );
};
