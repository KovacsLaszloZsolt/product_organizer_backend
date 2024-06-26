import { Status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ownerId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  imagesFolderId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brandId: number;

  @IsOptional()
  @IsString()
  picturesRoute: string;

  @IsString()
  status: Status;

  @Transform(({ value }) => {
    return value === 'true' ? true : false;
  })
  @IsBoolean()
  withDelivery: boolean;
}
