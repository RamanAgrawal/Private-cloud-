import React from 'react';
import { useSocket } from '../hooks/useSocket';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { Touchpad } from '../components/Touchpad';
import { MouseButtons } from '../components/MouseButtons';
import { MediaControls } from '../components/MediaControls';
import { SystemActions } from '../components/SystemActions';

export const RemoteControl: React.FC = () => {
  const { socket, status, error } = useSocket();
  const disabled = status !== 'connected';

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col items-center px-4 py-6 gap-6 max-w-md mx-auto">
      {/* Header */}
      <header className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-accent text-xl">⌨</span>
          <h1 className="text-lg font-bold font-mono tracking-tight text-white">
            Remote<span className="text-accent">Control</span>
          </h1>
        </div>
        <ConnectionStatus status={status} error={error} />
      </header>

      {/* Touchpad */}
      <section className="w-full">
        <Touchpad socket={socket} disabled={disabled} />
      </section>

      {/* Mouse Buttons */}
      <section className="w-full">
        <h2 className="section-title">Mouse</h2>
        <MouseButtons socket={socket} disabled={disabled} />
      </section>

      {/* Media Controls */}
      <section className="w-full">
        <MediaControls socket={socket} disabled={disabled} />
      </section>

      {/* System Actions */}
      <section className="w-full">
        <SystemActions socket={socket} disabled={disabled} />
      </section>

      <footer className="text-xs text-gray-600 font-mono mt-auto">
        Local Network Only · Phase 1
      </footer>
    </div>
  );
};
