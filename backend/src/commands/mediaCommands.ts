// eslint-disable-next-line @typescript-eslint/no-var-requires
const robot = require('robotjs') as typeof import('robotjs');

export function volumeUp(): void {
  robot.keyTap('audio_vol_up');
}

export function volumeDown(): void {
  robot.keyTap('audio_vol_down');
}

export function playPause(): void {
  robot.keyTap('audio_play');
}
