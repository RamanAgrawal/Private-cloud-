import React from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  disabled: boolean;
}

const HOTKEYS = [
  { label: 'Ctrl+C',   key: 'c',       modifiers: ['control'] },
  { label: 'Ctrl+V',   key: 'v',       modifiers: ['control'] },
  { label: 'Ctrl+Z',   key: 'z',       modifiers: ['control'] },
  { label: 'Ctrl+Y',   key: 'y',       modifiers: ['control'] },
  { label: 'Ctrl+A',   key: 'a',       modifiers: ['control'] },
  { label: 'Alt+Tab',  key: 'tab',     modifiers: ['alt']     },
  { label: 'Esc',      key: 'escape',  modifiers: []          },
  { label: 'Enter',    key: 'enter',   modifiers: []          },
  { label: 'Win',      key: 'win',     modifiers: []          },
  { label: 'Ctrl+W',   key: 'w',       modifiers: ['control'] },
  { label: 'Ctrl+T',   key: 't',       modifiers: ['control'] },
  { label: '⌫ Del',    key: 'backspace', modifiers: []        },
] as const;

export const HotkeyButtons: React.FC<Props> = ({ socket, disabled }) => (
  <div>
    <h2 className="section-title">Hotkeys</h2>
    <div className="grid grid-cols-3 gap-2">
      {HOTKEYS.map(({ label, key, modifiers }) => (
        <button
          key={label}
          disabled={disabled}
          onPointerDown={() => socket?.emit('hotkey', { key, modifiers })}
          className="btn btn-secondary h-12 text-sm font-mono tracking-tight"
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);
