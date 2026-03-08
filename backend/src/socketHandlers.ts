import { Socket } from 'socket.io';
import { leftClick, rightClick, scrollUp, scrollDown } from './commands/mouseCommands';
import { volumeUp, volumeDown, playPause, toggleMute } from './commands/mediaCommands';
import { openChrome, lockScreen, shutdown } from './commands/systemCommands';
import { typeText, pressHotkey } from './commands/keyboardCommands';
import { brightnessUp, brightnessDown } from './commands/brightnessCommands';
import { setClipboard } from './commands/clipboardCommands';

export function registerSocketHandlers(socket: Socket): void {
  // ── Mouse ────────────────────────────────────────────────────────────────
  socket.on('left-click', () => {
    try { leftClick(); } catch (err) { console.error('[left-click]', err); }
  });

  socket.on('right-click', () => {
    try { rightClick(); } catch (err) { console.error('[right-click]', err); }
  });

  socket.on('scroll-up', () => {
    try { scrollUp(); } catch (err) { console.error('[scroll-up]', err); }
  });

  socket.on('scroll-down', () => {
    try { scrollDown(); } catch (err) { console.error('[scroll-down]', err); }
  });

  // ── Keyboard ─────────────────────────────────────────────────────────────
  socket.on('type-text', (payload: { text: string }) => {
    try {
      if (typeof payload?.text === 'string' && payload.text.length <= 500) {
        typeText(payload.text);
      }
    } catch (err) { console.error('[type-text]', err); }
  });

  socket.on('hotkey', (payload: { key: string; modifiers?: string[] }) => {
    try {
      if (typeof payload?.key === 'string') {
        pressHotkey(payload.key, payload.modifiers ?? []);
      }
    } catch (err) { console.error('[hotkey]', err); }
  });

  // ── Clipboard ────────────────────────────────────────────────────────────
  socket.on('set-clipboard', (payload: { text: string }) => {
    try {
      if (typeof payload?.text === 'string' && payload.text.length <= 10000) {
        setClipboard(payload.text);
      }
    } catch (err) { console.error('[set-clipboard]', err); }
  });

  // ── Media ────────────────────────────────────────────────────────────────
  socket.on('volume-up', () => {
    try { volumeUp(); } catch (err) { console.error('[volume-up]', err); }
  });

  socket.on('volume-down', () => {
    try { volumeDown(); } catch (err) { console.error('[volume-down]', err); }
  });

  socket.on('play-pause', () => {
    try { playPause(); } catch (err) { console.error('[play-pause]', err); }
  });

  socket.on('mute', () => {
    try { toggleMute(); } catch (err) { console.error('[mute]', err); }
  });

  // ── Brightness ───────────────────────────────────────────────────────────
  socket.on('brightness-up', () => {
    try { brightnessUp(); } catch (err) { console.error('[brightness-up]', err); }
  });

  socket.on('brightness-down', () => {
    try { brightnessDown(); } catch (err) { console.error('[brightness-down]', err); }
  });

  // ── System ───────────────────────────────────────────────────────────────
  socket.on('open-chrome', () => {
    try { openChrome(); } catch (err) { console.error('[open-chrome]', err); }
  });

  socket.on('lock-screen', () => {
    try { lockScreen(); } catch (err) { console.error('[lock-screen]', err); }
  });

  socket.on('shutdown', () => {
    try { shutdown(); } catch (err) { console.error('[shutdown]', err); }
  });
}
