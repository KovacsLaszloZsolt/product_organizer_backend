import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    return this.prisma.brand.create({ data: { ...createBrandDto } });
  }

  async findAll(filter?: Record<string, unknown>) {
    return this.prisma.brand.findMany({
      where: { ...filter, deleted_at: null },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllByIds(filter: number[]) {
    return this.prisma.brand.findMany({
      where: { id: { in: filter } },
      orderBy: { name: 'asc' },
    });
  }

  async findDeletedBrand(filter: Record<string, unknown>) {
    return this.prisma.brand.findMany({
      where: { ...filter, NOT: { deleted_at: null } },
    });
  }

  async findOne(filter) {
    return this.prisma.brand.findUnique({ where: filter });
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    return this.prisma.brand.update({
      where: { id },
      data: { ...updateBrandDto },
    });
  }

  async delete(id: number) {
    return this.prisma.brand.update({
      where: {
        id,
      },
      data: { deleted_at: new Date() },
    });
  }
}
