import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  disabled: boolean;
}

export const ClipboardInput: React.FC<Props> = ({ socket, disabled }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!text.trim() || disabled) return;
    socket?.emit('set-clipboard', { text });
    setSent(true);
    setTimeout(() => setSent(false), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="section-title mb-0">Clipboard</h2>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-accent font-mono underline underline-offset-2"
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
            placeholder="Paste or type text to push to PC clipboard…"
            rows={3}
            maxLength={10000}
            className="w-full rounded-lg bg-surface-card border border-surface-border px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-accent disabled:opacity-50 resize-none"
          />
          <button
            onClick={send}
            disabled={disabled || !text.trim()}
            className={`btn h-10 text-sm ${sent ? 'btn-secondary text-green-400' : 'btn-primary'}`}
          >
            {sent ? '✓ Copied to PC' : 'Push to PC Clipboard'}
          </button>
        </div>
      )}
    </div>
  );
};
