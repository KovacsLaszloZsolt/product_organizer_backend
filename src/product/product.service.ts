import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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
    const {
      categoryId,
      ownerId,
      status,
      imagesFolderId,
      brandId,
      search,
      page,
    } = filter;
    const dbFilter = {} as Record<string, unknown>;
    const pageQuery = {} as Record<string, unknown>;

    if (categoryId) {
      dbFilter.categoryId = { in: [categoryId] };
    }

    if (ownerId) {
      dbFilter.ownerId = { in: [ownerId] };
    }

    if (status) {
      dbFilter.status = { in: [status] };
    }

    if (imagesFolderId) {
      dbFilter.imagesFolderId = { in: [imagesFolderId] };
    }

    if (brandId) {
      dbFilter.brandId = { in: [brandId] };
    }

    if (page) {
      const itemsPerPage = 5;

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
      orderBy: [{ updated_at: 'desc' }],
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
}
