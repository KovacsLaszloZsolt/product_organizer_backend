import { Module } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  controllers: [BrandController],
  providers: [BrandService, ProductService],
})
export class BrandModule {}
