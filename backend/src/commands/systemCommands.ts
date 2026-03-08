import { exec } from 'child_process';
import os from 'os';

const platform = os.platform();

function run(cmd: string): void {
  exec(cmd, (err) => {
    if (err) console.error(`[system cmd error] ${cmd}:`, err.message);
  });
}

export function openChrome(): void {
  if (platform === 'linux') {
    run('google-chrome || chromium-browser || chromium');
  } else if (platform === 'darwin') {
    run('open -a "Google Chrome"');
  } else if (platform === 'win32') {
    run('start chrome');
  }
}

export function lockScreen(): void {
  if (platform === 'linux') {
    // Works with most DE lock managers; fallback chain
    run('loginctl lock-session || gnome-screensaver-command --lock || xdg-screensaver lock');
  } else if (platform === 'darwin') {
    run('/System/Library/CoreServices/Menu\\ Extras/User.menu/Contents/Resources/CGSession -suspend');
  } else if (platform === 'win32') {
    run('rundll32.exe user32.dll,LockWorkStation');
  }
}

export function shutdown(): void {
  if (platform === 'linux') {
    run('shutdown -h now');
  } else if (platform === 'darwin') {
    run('sudo shutdown -h now');
  } else if (platform === 'win32') {
    run('shutdown /s /t 0');
  }
}
