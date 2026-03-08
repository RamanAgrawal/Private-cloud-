import React, { useState } from 'react';
import { FileInfo } from '../types/files';

interface Props {
  file: FileInfo;
  onDeleted: (filename: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Build the shareable LAN download URL (points to backend directly). */
function buildShareURL(filename: string): string {
  return `${window.location.protocol}//${window.location.hostname}:3001/api/download/${filename}`;
}

export const FileItem: React.FC<Props> = ({ file, onDeleted }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/file/${encodeURIComponent(file.filename)}`, { method: 'DELETE' });
      if (res.ok) onDeleted(file.filename);
    } catch {
      // silently ignore — socket event will also notify
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(buildShareURL(file.filename));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ext = file.originalName.split('.').pop()?.toUpperCase() ?? '?';

  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-card border border-surface-border p-3 hover:border-accent/30 transition-colors">
      {/* Extension badge */}
      <div className="w-10 h-10 shrink-0 rounded-lg bg-surface-border flex items-center justify-center">
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">{ext.slice(0, 4)}</span>
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-mono text-white truncate leading-tight" title={file.originalName}>
          {file.originalName}
        </span>
        <span className="text-xs text-gray-500 font-mono">
          {formatBytes(file.size)} · {formatDate(file.uploadedAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Download */}
        <a
          href={`/api/download/${encodeURIComponent(file.filename)}`}
          download={file.originalName}
          title="Download"
          className="btn btn-secondary w-9 h-9 text-base"
        >
          ↓
        </a>

        {/* Copy link */}
        <button
          type="button"
          onClick={handleCopyLink}
          title="Copy share link"
          className={`btn w-9 h-9 text-sm ${copied ? 'btn-primary' : 'btn-secondary'}`}
        >
          {copied ? '✓' : '🔗'}
        </button>

        {/* Delete (two-tap) */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          title={confirmDelete ? 'Confirm delete' : 'Delete'}
          className={`btn w-9 h-9 text-sm transition-colors ${
            confirmDelete ? 'btn-danger animate-pulse' : 'btn-secondary'
          }`}
        >
          {deleting ? '…' : confirmDelete ? '!' : '🗑'}
        </button>
      </div>
    </div>
  );
};
