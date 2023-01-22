import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOwnerDto } from './dto/createOwner.dto';

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  async create(createOwnerDto: CreateOwnerDto) {
    return this.prisma.productOwner.create({ data: { ...createOwnerDto } });
  }

  async findAll() {
    return this.prisma.productOwner.findMany();
  }

  async findOne(filter: Record<string, unknown>) {
    return this.prisma.productOwner.findUnique({ where: filter });
  }

  async update(id: number, updateOwnerDto: CreateOwnerDto) {
    return this.prisma.productOwner.update({
      where: { id },
      data: { ...updateOwnerDto },
    });
  }

  async delete(id: number) {
    return this.prisma.productOwner.update({
      where: {
        id,
      },
      data: { deleted_at: new Date() },
    });
  }
}
