// eslint-disable-next-line @typescript-eslint/no-var-requires
const robot = require('robotjs') as typeof import('robotjs');

/**
 * Move the mouse cursor relative to its current position.
 */
export function moveMouse(dx: number, dy: number): void {
  const { x, y } = robot.getMousePos();
  robot.moveMouse(x + dx, y + dy);
}

export function leftClick(): void {
  robot.mouseClick('left');
}

export function rightClick(): void {
  robot.mouseClick('right');
}
