import path from 'path';
import multer from 'multer';
import fs from 'fs-extra';

// Storage directory at the project root level
export const STORAGE_DIR = path.join(__dirname, '../../storage');

// Ensure the storage directory exists on startup
fs.ensureDirSync(STORAGE_DIR);

/** Strip characters that could be dangerous in filenames. */
export function sanitizeFilename(raw: string): string {
  // Grab only the base name — no directory components
  const base = path.basename(raw);
  return base
    .replace(/[^a-zA-Z0-9.\-_ ]/g, '_') // allow safe chars only
    .replace(/\.{2,}/g, '_')             // collapse consecutive dots
    .replace(/^\./, '_')                 // no leading dot (hidden files)
    .trim()
    || 'file';
}

/** Validate a stored filename before serving / deleting it. */
export function isValidStoredFilename(filename: string): boolean {
  if (!filename) return false;
  // Must not contain any path separators or traversal sequences
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) return false;
  // Must resolve to exactly inside STORAGE_DIR
  const resolved = path.resolve(STORAGE_DIR, filename);
  return resolved.startsWith(STORAGE_DIR + path.sep) || resolved === STORAGE_DIR;
}

// ── Multer storage engine ──────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, STORAGE_DIR),
  filename: (_req, file, cb) => {
    const safe = sanitizeFilename(file.originalname);
    // Prepend timestamp for uniqueness
    cb(null, `${Date.now()}_${safe}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB max
});
