import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';
import { UploadResult } from './interfaces/upload.interface';
import { MAX_FILE_SIZE } from './upload.contants';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadResult[]> {
    return this.uploadService.saveFiles(files);
  }

  @Delete(':key')
  async delete(@Param('key') key: string) {
    await this.uploadService.deleteFile(key);
    return { message: 'Arquivo removido' };
  }
}   