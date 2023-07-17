import { Module } from '@nestjs/common';
import { BrandService } from 'src/brand/brand.service';
import { CategoryService } from 'src/category/category.service';
import { ImageService } from 'src/image/image.service';
import { OwnerService } from 'src/owner/owner.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [
    BrandService,
    CategoryService,
    ImageService,
    OwnerService,
    ProductService,
  ],
})
export class ProductsModule {}
