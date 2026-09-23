import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { UploadResult } from './interfaces/upload.interface';
import {
  ALLOWED_MIME_TYPES,
  generateFilename,
  UPLOAD_DIR,
} from './upload.contants';

@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = this.config.get<string>('UPLOAD_DIR', UPLOAD_DIR);
    this.baseUrl = this.config.get<string>('BASE_URL', 'http://localhost:8001');
  }

  async saveFile(file: Express.Multer.File): Promise<UploadResult> {
    this.validateFile(file);

    const filename = generateFilename(file.originalname);
    const filePath = join(this.uploadDir, filename);

    await fs.mkdir(this.uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    return {
      key: filename,
      url: `${this.baseUrl}/uploads/${filename}`,
      size: file.size,
      mimeType: file.mimetype,
      originalName: file.originalname,
    };
  }

  async saveFiles(files: Express.Multer.File[]): Promise<UploadResult[]> {
    return Promise.all(files.map((file) => this.saveFile(file)));
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = join(this.uploadDir, key);
    await fs.unlink(filePath);
  }

  private validateFile(file: Express.Multer.File): void {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido. Aceitos: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }
  }
}
