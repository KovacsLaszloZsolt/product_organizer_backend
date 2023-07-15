import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteImageFolderDto {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
