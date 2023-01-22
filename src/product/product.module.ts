import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { OwnerService } from 'src/owner/owner.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, OwnerService],
})
export class ProductsModule {}
