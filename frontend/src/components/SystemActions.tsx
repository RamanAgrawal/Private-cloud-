import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  disabled: boolean;
}

export const SystemActions: React.FC<Props> = ({ socket, disabled }) => {
  const [confirmShutdown, setConfirmShutdown] = useState(false);

  const handleShutdown = () => {
    if (!confirmShutdown) {
      setConfirmShutdown(true);
      // Auto-cancel confirmation after 4 s
      setTimeout(() => setConfirmShutdown(false), 4000);
      return;
    }
    socket?.emit('shutdown');
    setConfirmShutdown(false);
  };

  return (
    <div>
      <h2 className="section-title">System</h2>
      <div className="grid grid-cols-1 gap-3">
        <button
          onPointerDown={() => socket?.emit('open-chrome')}
          disabled={disabled}
          className="btn btn-secondary h-14 text-base"
        >
          🌐 Open Chrome
        </button>
        <button
          onPointerDown={() => socket?.emit('lock-screen')}
          disabled={disabled}
          className="btn btn-secondary h-14 text-base"
        >
          🔒 Lock Screen
        </button>
        <button
          onPointerDown={handleShutdown}
          disabled={disabled}
          className={`btn h-14 text-base transition-all duration-200 ${
            confirmShutdown
              ? 'bg-danger hover:bg-red-600 text-white border-danger ring-2 ring-danger/50'
              : 'btn-danger'
          }`}
        >
          {confirmShutdown ? '⚠️ Tap again to confirm shutdown' : '⏻ Shutdown'}
        </button>
      </div>
    </div>
  );
};
