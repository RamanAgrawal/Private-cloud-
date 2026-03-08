// eslint-disable-next-line @typescript-eslint/no-var-requires
const robot = require('@jitsi/robotjs') as typeof import('@jitsi/robotjs');

export function leftClick(): void {
  robot.mouseClick('left');
}

export function rightClick(): void {
  robot.mouseClick('right');
}

export function scrollUp(): void {
  robot.scrollMouse(0, 3);
}

export function scrollDown(): void {
  robot.scrollMouse(0, -3);
}
