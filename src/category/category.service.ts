import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: { ...createCategoryDto } });
  }

  async findAll(filter?: Record<string, unknown>) {
    return this.prisma.category.findMany({
      where: { ...filter, deleted_at: null },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllByIds(filter: number[]) {
    return this.prisma.category.findMany({
      where: { id: { in: filter } },
      orderBy: { name: 'asc' },
    });
  }

  async findDeletedCategory(filter: Record<string, unknown>) {
    return this.prisma.category.findMany({
      where: { ...filter, NOT: { deleted_at: null } },
    });
  }

  async findOne(filter) {
    return this.prisma.category.findUnique({ where: filter });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto },
    });
  }

  async delete(id: number) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: { deleted_at: new Date() },
    });
  }
}
