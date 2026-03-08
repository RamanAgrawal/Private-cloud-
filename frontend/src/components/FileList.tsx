import React, { useCallback, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { FileInfo, FilesResponse } from '../types/files';
import { FileItem } from './FileItem';

interface Props {
  socket: Socket | null;
  /** Bumped by parent when a new upload completes (triggers refresh). */
  refreshKey: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const FileList: React.FC<Props> = ({ socket, refreshKey }) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/files');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FilesResponse = await res.json();
      setFiles(data.files);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + re-fetch when refreshKey changes (new upload)
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshKey]);

  // Real-time updates from Socket.IO
  useEffect(() => {
    if (!socket) return;

    const onUploaded = () => fetchFiles();
    const onDeleted = () => fetchFiles();

    socket.on('file-uploaded', onUploaded);
    socket.on('file-deleted', onDeleted);

    return () => {
      socket.off('file-uploaded', onUploaded);
      socket.off('file-deleted', onDeleted);
    };
  }, [socket, fetchFiles]);

  const handleDeleted = (filename: string) => {
    setFiles((prev) => prev.filter((f) => f.filename !== filename));
    setStats((prev) => {
      const removed = files.find((f) => f.filename === filename);
      return {
        totalFiles: prev.totalFiles - 1,
        totalSize: prev.totalSize - (removed?.size ?? 0),
      };
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between rounded-xl bg-surface-card border border-surface-border px-4 py-3">
        <div className="flex flex-col">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Files</span>
          <span className="text-xl font-bold font-mono text-white">{stats.totalFiles}</span>
        </div>
        <div className="w-px h-8 bg-surface-border" />
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Used</span>
          <span className="text-xl font-bold font-mono text-white">{formatBytes(stats.totalSize)}</span>
        </div>
        <button
          type="button"
          onClick={fetchFiles}
          title="Refresh"
          className="btn btn-secondary w-9 h-9 text-base ml-2"
        >
          ↻
        </button>
      </div>

      {/* File list body */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-600 font-mono text-sm animate-pulse">
          Loading…
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 py-10">
          <span className="text-danger text-sm font-mono">{error}</span>
          <button type="button" onClick={fetchFiles} className="btn btn-secondary h-9 px-4 text-xs">
            Retry
          </button>
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-gray-600">
          <span className="text-3xl">🗂</span>
          <span className="text-sm font-mono">No files yet. Upload one above.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <FileItem key={file.filename} file={file} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
};
