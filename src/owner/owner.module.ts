import { Module } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService, ProductService],
})
export class OwnerModule {}
