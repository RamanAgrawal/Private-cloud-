import React, { useCallback, useRef, useState } from 'react';
import { FileInfo } from '../types/files';

interface Props {
  onUploaded: (file: FileInfo) => void;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'done' | 'error';
  progress: number; // 0-100
  error: string | null;
  filename: string | null;
}

function uploadFile(file: File, onProgress: (pct: number) => void): Promise<FileInfo> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.responseText) as FileInfo);
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
}

export const UploadDropzone: React.FC<Props> = ({ onUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    error: null,
    filename: null,
  });
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      setState({ status: 'uploading', progress: 0, error: null, filename: file.name });

      try {
        const result = await uploadFile(file, (pct) => {
          setState((s) => ({ ...s, progress: pct }));
        });
        setState({ status: 'done', progress: 100, error: null, filename: file.name });
        onUploaded(result);
        // Reset to idle after a moment
        setTimeout(() => setState({ status: 'idle', progress: 0, error: null, filename: null }), 2000);
      } catch (err) {
        setState({
          status: 'error',
          progress: 0,
          error: err instanceof Error ? err.message : 'Upload failed',
          filename: file.name,
        });
      }
    },
    [onUploaded],
  );

  // ── Drag handlers ──────────────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const onDragLeave = () => setIsDragOver(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const isUploading = state.status === 'uploading';

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-3
          rounded-xl border-2 border-dashed p-8 text-center
          transition-all duration-150 cursor-pointer select-none
          ${isDragOver
            ? 'border-accent bg-accent/10 scale-[1.01]'
            : 'border-surface-border bg-surface-card hover:border-accent/50'}
          ${isUploading ? 'pointer-events-none opacity-80' : ''}
        `}
      >
        <span className="text-4xl">{isDragOver ? '📂' : '📁'}</span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-mono font-semibold text-gray-200">
            {isDragOver ? 'Drop to upload' : 'Drag & drop a file here'}
          </p>
          <p className="text-xs text-gray-500">or click to browse · max 500 MB</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Browse button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="btn btn-primary h-12 text-sm font-mono"
      >
        Choose File
      </button>

      {/* Progress / status bar */}
      {state.status !== 'idle' && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400 truncate max-w-[70%]">{state.filename}</span>
            <span
              className={
                state.status === 'error'
                  ? 'text-danger'
                  : state.status === 'done'
                  ? 'text-success'
                  : 'text-accent'
              }
            >
              {state.status === 'error'
                ? state.error
                : state.status === 'done'
                ? 'Done ✓'
                : `${state.progress}%`}
            </span>
          </div>
          {state.status === 'uploading' && (
            <div className="w-full h-1.5 rounded-full bg-surface-border overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-200"
                style={{ width: `${state.progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
