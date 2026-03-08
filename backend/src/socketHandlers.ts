import { Socket } from 'socket.io';
import { moveMouse, leftClick, rightClick } from './commands/mouseCommands';
import { volumeUp, volumeDown, playPause } from './commands/mediaCommands';
import { openChrome, lockScreen, shutdown } from './commands/systemCommands';

export interface MouseMovePayload {
  dx: number;
  dy: number;
}

export function registerSocketHandlers(socket: Socket): void {
  // ── Mouse ────────────────────────────────────────────────────────────────
  socket.on('mouse-move', (payload: MouseMovePayload) => {
    try {
      moveMouse(payload.dx, payload.dy);
    } catch (err) {
      console.error('[mouse-move]', err);
    }
  });

  socket.on('left-click', () => {
    try {
      leftClick();
    } catch (err) {
      console.error('[left-click]', err);
    }
  });

  socket.on('right-click', () => {
    try {
      rightClick();
    } catch (err) {
      console.error('[right-click]', err);
    }
  });

  // ── Media ────────────────────────────────────────────────────────────────
  socket.on('volume-up', () => {
    try {
      volumeUp();
    } catch (err) {
      console.error('[volume-up]', err);
    }
  });

  socket.on('volume-down', () => {
    try {
      volumeDown();
    } catch (err) {
      console.error('[volume-down]', err);
    }
  });

  socket.on('play-pause', () => {
    try {
      playPause();
    } catch (err) {
      console.error('[play-pause]', err);
    }
  });

  // ── System ───────────────────────────────────────────────────────────────
  socket.on('open-chrome', () => {
    try {
      openChrome();
    } catch (err) {
      console.error('[open-chrome]', err);
    }
  });

  socket.on('lock-screen', () => {
    try {
      lockScreen();
    } catch (err) {
      console.error('[lock-screen]', err);
    }
  });

  socket.on('shutdown', () => {
    try {
      shutdown();
    } catch (err) {
      console.error('[shutdown]', err);
    }
  });
}
