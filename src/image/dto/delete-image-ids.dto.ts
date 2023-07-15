import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class DeleteImageIdsDto {
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  ids: string[];
}
