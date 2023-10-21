import { Injectable } from '@nestjs/common';
import { itemsPerPage } from 'src/constants/itemPerPage';
import { PrismaService } from 'src/prisma/prisma.service';
import { createDbFilters } from 'src/utils/createDbFilters';
import { CreateProductDto } from './dto/create-product.dto';
import { FindAllProductDto } from './dto/find-all-product.dto';
import { SaveImageDto } from './dto/save-image.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto & SaveImageDto) {
    return this.prisma.$transaction(async (transaction) => {
      const { images, ...rest } = createProductDto;
      const product = await transaction.product.create({
        data: { ...rest },
      });

      if (images) {
        const imageWithProductId = images.map((image) => ({
          ...image,
          productId: product.id,
        }));

        await transaction.image.createMany({
          data: imageWithProductId,
        });
      }

      const newProduct = await transaction.product.findUnique({
        where: { id: product.id },
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
          brand: {
            select: {
              name: true,
              id: true,
            },
          },
          imagesFolder: {
            select: {
              name: true,
              id: true,
            },
          },
          images: {
            select: {
              id: true,
              cloudinaryPublicId: true,
              originalName: true,
            },
          },
        },
      });

      return newProduct;
    });
  }

  async findAll(filter: FindAllProductDto) {
    const { status, search, page, ...rest } = filter;

    const dbFilter = createDbFilters(rest);
    const pageQuery = {} as Record<string, unknown>;

    if (status) {
      dbFilter.status = { in: status };
    }

    if (page) {
      pageQuery.skip = (page - 1) * itemsPerPage;
      pageQuery.take = itemsPerPage;
    }

    if (search) {
      dbFilter.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    dbFilter.deleted_at = null;

    return this.prisma.product.findMany({
      where: dbFilter,
      include: {
        brand: {
          select: {
            name: true,
            id: true,
          },
        },
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
        images: {
          select: {
            id: true,
            cloudinaryPublicId: true,
            originalName: true,
          },
        },
      },
      ...pageQuery,
      orderBy: [{ created_at: 'desc' }],
    });
  }

  async findOne(id: number) {
    const filter = {} as Record<string, unknown>;

    filter.id = id;
    const product = await this.prisma.product.findFirstOrThrow({
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
        images: {
          select: {
            id: true,
            cloudinaryPublicId: true,
            originalName: true,
          },
        },
      },
    });

    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<Omit<UpdateProductDto, 'deletedImages'>>,
  ) {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
      },
    });
  }

  remove(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async count(filter: FindAllProductDto) {
    const { status, search, ...rest } = filter;

    const dbFilter = createDbFilters(rest);

    if (status) {
      dbFilter.status = { in: status };
    }

    if (search) {
      dbFilter.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    dbFilter.deleted_at = null;

    return this.prisma.product.count({
      where: dbFilter,
    });
  }
}
