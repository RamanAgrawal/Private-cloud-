// eslint-disable-next-line @typescript-eslint/no-var-requires
const robot = require('@jitsi/robotjs') as typeof import('@jitsi/robotjs');

export function typeText(text: string): void {
  robot.typeString(text);
}

export function pressHotkey(key: string, modifiers: string[] = []): void {
  if (modifiers.length > 0) {
    robot.keyTap(key, modifiers);
  } else {
    robot.keyTap(key);
  }
}
