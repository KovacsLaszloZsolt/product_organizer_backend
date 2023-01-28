import { Module } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, ProductService],
})
export class CategoryModule {}
