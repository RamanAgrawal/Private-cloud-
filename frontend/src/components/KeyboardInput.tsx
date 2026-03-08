import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  disabled: boolean;
}

export const KeyboardInput: React.FC<Props> = ({ socket, disabled }) => {
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim() || disabled) return;
    socket?.emit('type-text', { text });
    setText('');
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send();
  };

  return (
    <div>
      <h2 className="section-title">Type Text</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          disabled={disabled}
          placeholder="Type something…"
          maxLength={500}
          className="flex-1 rounded-lg bg-surface-card border border-surface-border px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-accent disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={disabled || !text.trim()}
          className="btn btn-primary px-4 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};
