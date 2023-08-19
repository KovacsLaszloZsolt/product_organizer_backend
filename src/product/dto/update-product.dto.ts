import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @Transform(({ value }) => JSON.parse(value))
  @IsOptional()
  @IsArray()
  deletedImages: { id: number; publicId: string }[];

  @IsOptional()
  status;

  @IsOptional()
  note: string;
}
