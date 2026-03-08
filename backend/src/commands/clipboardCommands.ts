import { spawn } from 'child_process';
import os from 'os';

const platform = os.platform();

export function setClipboard(text: string): void {
  if (platform === 'win32') {
    // Use PowerShell EncodedCommand so arbitrary text is safe (no shell injection)
    const script = `Set-Clipboard -Value '${text.replace(/'/g, "''")}'`;
    const encoded = Buffer.from(script, 'utf16le').toString('base64');
    const ps = spawn('powershell', ['-NonInteractive', '-EncodedCommand', encoded]);
    ps.on('error', (err) => console.error('[clipboard]', err.message));
  } else if (platform === 'linux') {
    const proc = spawn('xclip', ['-selection', 'clipboard']);
    proc.stdin.write(text);
    proc.stdin.end();
    proc.on('error', (err) => console.error('[clipboard]', err.message));
  } else if (platform === 'darwin') {
    const proc = spawn('pbcopy');
    proc.stdin.write(text);
    proc.stdin.end();
    proc.on('error', (err) => console.error('[clipboard]', err.message));
  }
}
