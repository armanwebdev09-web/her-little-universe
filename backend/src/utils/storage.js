import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const PUBLIC_DIR = path.join(UPLOADS_DIR, 'public');
const PRIVATE_DIR = path.join(UPLOADS_DIR, 'private');

// Ensure local storage directories exist for dev fallback
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(PRIVATE_DIR)) {
  fs.mkdirSync(PRIVATE_DIR, { recursive: true });
}

export const storageService = {
  /**
   * Save an uploaded file to storage (S3/R2 or Local Fallback)
   */
  saveFile: async ({ buffer, originalName, mimeType, size, visibility = 'PUBLIC', mediaType = 'IMAGE' }) => {
    const ext = path.extname(originalName) || getExtFromMime(mimeType);
    const uuid = crypto.randomUUID();
    const subfolder = mediaType.toLowerCase() + 's';
    const relativeKey = `${visibility.toLowerCase()}/${subfolder}/${uuid}${ext}`;

    const targetDir = visibility === 'PRIVATE' ? PRIVATE_DIR : PUBLIC_DIR;
    const fileDir = path.join(targetDir, subfolder);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    const filePath = path.join(targetDir, subfolder, `${uuid}${ext}`);
    await fs.promises.writeFile(filePath, buffer);

    const publicBase = process.env.PUBLIC_MEDIA_BASE_URL || 'http://localhost:5000/uploads/public';
    const publicUrl = visibility === 'PUBLIC' ? `${publicBase}/${subfolder}/${uuid}${ext}` : null;

    return {
      storageKey: relativeKey,
      originalName,
      mimeType,
      size,
      visibility,
      mediaType,
      url: publicUrl,
      filePath,
    };
  },

  /**
   * Get stream/path for private media viewing
   */
  getPrivateFilePath: (storageKey) => {
    // Sanitize storage key against directory traversal
    const sanitizedKey = storageKey.replace(/^private\//, '').replace(/\.\./g, '');
    const fullPath = path.join(PRIVATE_DIR, sanitizedKey);

    if (!fs.existsSync(fullPath)) {
      return null;
    }
    return fullPath;
  },

  /**
   * Delete file from storage
   */
  deleteFile: async (storageKey) => {
    try {
      const isPrivate = storageKey.startsWith('private/');
      const baseDir = isPrivate ? PRIVATE_DIR : PUBLIC_DIR;
      const relative = storageKey.replace(/^(public|private)\//, '').replace(/\.\./g, '');
      const fullPath = path.join(baseDir, relative);

      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
      return true;
    } catch (err) {
      console.warn("Storage delete error:", err);
      return false;
    }
  },
};

function getExtFromMime(mimeType) {
  switch (mimeType) {
    case 'image/jpeg': return '.jpg';
    case 'image/png': return '.png';
    case 'image/webp': return '.webp';
    case 'image/gif': return '.gif';
    case 'audio/mpeg': return '.mp3';
    case 'audio/wav': return '.wav';
    case 'audio/mp4': return '.m4a';
    case 'audio/ogg': return '.ogg';
    case 'video/mp4': return '.mp4';
    case 'video/webm': return '.webm';
    default: return '.bin';
  }
}
