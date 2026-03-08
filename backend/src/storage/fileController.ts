import path from 'path';
import fs from 'fs-extra';
import { STORAGE_DIR } from './uploadHandler';

export interface FileInfo {
  filename: string;     // stored name  (e.g. "1700000000000_photo.jpg")
  originalName: string; // display name (e.g. "photo.jpg")
  size: number;         // bytes
  uploadedAt: string;   // ISO-8601
  mimetype: string;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;    // bytes
}

const META_EXT = '.meta.json';

/** Write a sidecar metadata file next to the uploaded file. */
export async function writeMeta(
  storedFilename: string,
  data: { originalName: string; mimetype: string },
): Promise<void> {
  const metaPath = path.join(STORAGE_DIR, storedFilename + META_EXT);
  await fs.writeJson(metaPath, {
    originalName: data.originalName,
    mimetype: data.mimetype,
    uploadedAt: new Date().toISOString(),
  });
}

/** Read a sidecar metadata file, returning defaults if missing. */
async function readMeta(
  storedFilename: string,
): Promise<{ originalName: string; mimetype: string; uploadedAt: string }> {
  const metaPath = path.join(STORAGE_DIR, storedFilename + META_EXT);
  try {
    return await fs.readJson(metaPath);
  } catch {
    // No meta — fall back to filename-derived values
    return {
      originalName: storedFilename.replace(/^\d+_/, ''), // strip timestamp prefix
      mimetype: 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
    };
  }
}

/** Return all uploaded files with metadata. */
export async function listFiles(): Promise<{ files: FileInfo[]; stats: StorageStats }> {
  await fs.ensureDir(STORAGE_DIR);

  const entries = await fs.readdir(STORAGE_DIR);
  // Ignore meta sidecar files
  const dataFiles = entries.filter((f) => !f.endsWith(META_EXT));

  const files: FileInfo[] = await Promise.all(
    dataFiles.map(async (filename) => {
      const filePath = path.join(STORAGE_DIR, filename);
      const stat = await fs.stat(filePath);
      const meta = await readMeta(filename);
      return {
        filename,
        originalName: meta.originalName,
        size: stat.size,
        uploadedAt: meta.uploadedAt,
        mimetype: meta.mimetype,
      };
    }),
  );

  // Newest first
  files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const stats: StorageStats = {
    totalFiles: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
  };

  return { files, stats };
}

/** Delete a stored file and its sidecar. */
export async function deleteFile(storedFilename: string): Promise<void> {
  const filePath = path.join(STORAGE_DIR, storedFilename);
  const metaPath = filePath + META_EXT;

  await fs.remove(filePath);
  await fs.remove(metaPath).catch(() => undefined); // meta may not exist
}

/** Resolve the absolute path for a stored filename after validation. */
export function resolveFilePath(storedFilename: string): string {
  return path.join(STORAGE_DIR, storedFilename);
}
