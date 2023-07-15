import { IsArray, IsOptional } from 'class-validator';

export class SaveImageDto {
  @IsOptional()
  @IsArray()
  images: Image[];
}

export interface Image {
  originalName: string;
  cloudinaryId: string;
  cloudinaryPublicId: string;
}
