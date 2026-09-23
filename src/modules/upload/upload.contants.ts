import { extname } from 'path';
import { randomUUID } from 'crypto';

export const UPLOAD_DIR = './uploads';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; 

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
];

export const generateFilename = (originalname: string): string => {
  const ext = extname(originalname);
  return `${randomUUID()}${ext}`;
};   