export interface FileInfo {
  filename: string;     // stored name (e.g. "1700000000000_photo.jpg")
  originalName: string; // display name (e.g. "photo.jpg")
  size: number;         // bytes
  uploadedAt: string;   // ISO-8601
  mimetype: string;
}

export interface FilesResponse {
  files: FileInfo[];
  stats: {
    totalFiles: number;
    totalSize: number;
  };
}
