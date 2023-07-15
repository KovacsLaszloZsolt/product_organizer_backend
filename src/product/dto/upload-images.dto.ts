import { IsOptional } from 'class-validator';

export class UploadImagesDto {
  @IsOptional()
  images: Express.Multer.File[];
}
