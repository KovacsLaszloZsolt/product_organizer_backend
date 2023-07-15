import { Status } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

interface Value {
  value: string;
}
export class FindAllProductDto {
  @Transform(({ value }: Value) => value.split(',').map((item) => +item))
  @IsArray()
  @IsOptional()
  categoryId?: number[];

  @Transform(({ value }: Value) => value.split(',').map((item) => +item))
  @IsArray()
  @IsOptional()
  ownerId?: number[];

  @Transform(({ value }: Value) => value.split(','))
  @IsArray()
  @IsOptional()
  status?: Status[];

  @Transform(({ value }: Value) => value.split(',').map((item) => +item))
  @IsArray()
  @IsOptional()
  imagesFolderId?: number[];

  @Transform(({ value }: Value) => value.split(',').map((item) => +item))
  @IsArray()
  @IsOptional()
  brandId?: number[];

  @IsOptional()
  search?: string;

  @Transform(({ value }: Value) => +value)
  @IsOptional()
  page?: number;
}
