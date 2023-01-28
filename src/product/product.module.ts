import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { OwnerService } from 'src/owner/owner.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, OwnerService, CategoryService],
})
export class ProductsModule {}
