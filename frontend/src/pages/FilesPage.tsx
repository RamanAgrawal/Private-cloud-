import React, { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { UploadDropzone } from '../components/UploadDropzone';
import { FileList } from '../components/FileList';
import { FileInfo } from '../types/files';

export const FilesPage: React.FC = () => {
  const { socket, status, error } = useSocket();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploaded = (_file: FileInfo) => {
    // Bump the key so FileList re-fetches (socket event also triggers refresh,
    // but this is an immediate local response for the uploading device)
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col items-center px-4 py-6 gap-6 max-w-md mx-auto pb-24">
      {/* Header */}
      <header className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-accent text-xl">📁</span>
          <h1 className="text-lg font-bold font-mono tracking-tight text-white">
            LAN<span className="text-accent">Share</span>
          </h1>
        </div>
        <ConnectionStatus status={status} error={error} />
      </header>

      {/* Upload section */}
      <section className="w-full">
        <h2 className="section-title">Upload</h2>
        <UploadDropzone onUploaded={handleUploaded} />
      </section>

      {/* File list section */}
      <section className="w-full">
        <h2 className="section-title">Shared Files</h2>
        <FileList socket={socket} refreshKey={refreshKey} />
      </section>

      <footer className="text-xs text-gray-600 font-mono mt-auto">
        Local Network Only · Phase 2
      </footer>
    </div>
  );
};
