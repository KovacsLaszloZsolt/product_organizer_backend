import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllProductDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  owner: number;
}
