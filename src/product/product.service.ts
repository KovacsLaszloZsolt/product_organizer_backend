import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({
      data: { ...createProductDto },
    });
    return product;
  }

  async findAll({
    categoryId,
    ownerId,
  }: {
    categoryId?: number;
    ownerId?: number;
  }): Promise<Product[]> {
    const filter = {} as Record<string, unknown>;

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (ownerId) {
      filter.ownerId = ownerId;
    }

    return this.prisma.product.findMany({
      where: filter,
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        owner: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { ...updateProductDto },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
