import { exec } from 'child_process';
import os from 'os';

const platform = os.platform();

function psRun(script: string): void {
  const encoded = Buffer.from(script, 'utf16le').toString('base64');
  exec(`powershell -NonInteractive -EncodedCommand ${encoded}`, (err) => {
    if (err) console.error('[brightness]', err.message);
  });
}

function run(cmd: string): void {
  exec(cmd, (err) => {
    if (err) console.error('[brightness]', err.message);
  });
}

export function brightnessUp(): void {
  if (platform === 'win32') {
    psRun(
      `$b = (Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness).CurrentBrightness;` +
      `$n = [Math]::Min([int]$b + 10, 100);` +
      `(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, $n)`
    );
  } else if (platform === 'linux') {
    run('brightnessctl set +10%');
  } else if (platform === 'darwin') {
    // macOS brightness up key
    run(`osascript -e 'tell application "System Events" to key code 144'`);
  }
}

export function brightnessDown(): void {
  if (platform === 'win32') {
    psRun(
      `$b = (Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness).CurrentBrightness;` +
      `$n = [Math]::Max([int]$b - 10, 0);` +
      `(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, $n)`
    );
  } else if (platform === 'linux') {
    run('brightnessctl set 10%-');
  } else if (platform === 'darwin') {
    run(`osascript -e 'tell application "System Events" to key code 145'`);
  }
}
