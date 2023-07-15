import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { isEmpty, isNil } from 'lodash';
import { Roles } from 'src/auth/decorator';
import { RolesGuard } from 'src/auth/guard';
import { CategoryService } from 'src/category/category.service';
import { ImageService } from 'src/image/image.service';
import { OwnerService } from 'src/owner/owner.service';
import { createCloudinaryImageUrl } from 'src/utils/createCloudinaryImageUrl';
import {
  ValidMimeType,
  validateImageMimeType,
} from 'src/utils/validateImageMimeType';
import {
  CreateProductDto,
  FindAllProductDto,
  Image,
  UpdateProductDto,
} from './dto/index.dto';
import { ProductService } from './product.service';

@Controller('api/product')
export class ProductController {
  constructor(
    private readonly productsService: ProductService,
    private readonly ownerService: OwnerService,
    private readonly categoryService: CategoryService,
    private readonly imageService: ImageService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, {}))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ) {
    let images;
    if (files && !isEmpty(files)) {
      try {
        const promises = files.map((file) => {
          if (!validateImageMimeType(file.mimetype)) {
            throw new BadRequestException('Invalid image mime type');
          }

          return this.imageService.uploadImageToCloudinary(
            file.buffer.toString('base64'),
            file.mimetype as ValidMimeType,
          );
        });

        const resImages = await Promise.all(promises);

        images = resImages.map((image, index) => {
          const { asset_id, public_id } = image;

          return {
            originalName: files[index].originalname,
            cloudinaryId: asset_id,
            cloudinaryPublicId: public_id,
          };
        });
      } catch (err) {
        throw new Error('Error occurred while uploading image');
      }
    }

    let productWithImages;

    try {
      productWithImages = await this.productsService.create({
        ...createProductDto,
        images: images ?? [],
      });
    } catch (err) {
      await this.imageService.deleteImagesFromCloudinary({
        ids: images?.map((image) => image.cloudinaryPublicId) ?? [],
      });
      throw err;
    }

    const imgs = productWithImages?.images;

    let imagesWithUrl;
    if (imgs) {
      imagesWithUrl = createCloudinaryImageUrl(
        imgs.map((image) => ({
          id: image.id,
          publicId: image.cloudinaryPublicId,
          originalName: image.originalName,
        })),
      );
    }

    return { ...productWithImages, images: imagesWithUrl };
  }

  @Get()
  async findAll(@Query() params?: FindAllProductDto) {
    const filter = {} as FindAllProductDto;

    const { ownerId, categoryId, status, imagesFolderId, search, page } =
      params ?? ({} as FindAllProductDto);

    if (ownerId) {
      const selectedOwner = await this.ownerService.findAllByIds(ownerId);

      if (isEmpty(selectedOwner)) {
        throw new BadRequestException('Invalid owner id');
      }

      filter.ownerId = ownerId;
    }

    if (categoryId) {
      const selectedCategory = await this.categoryService.findAllByIds(
        categoryId,
      );

      if (isEmpty(selectedCategory)) {
        throw new BadRequestException('Invalid category id');
      }

      filter.categoryId = categoryId;
    }

    if (status || !isEmpty(status)) {
      filter.status = status;
    }

    if (imagesFolderId) {
      const selectedImagesFolder =
        await this.imageService.findImagesFoldersByIds(imagesFolderId);

      if (isEmpty(selectedImagesFolder)) {
        throw new BadRequestException('Invalid image folder id');
      }

      filter.imagesFolderId = imagesFolderId;
    }

    const products = await this.productsService.findAll({
      ...filter,
      search,
      page,
    });

    const response = products.map((product) => {
      const { images, ...rest } = product;

      let imagesWithUrl;
      if (images) {
        imagesWithUrl = createCloudinaryImageUrl(
          images.map((image) => ({
            id: image.id,
            publicId: image.cloudinaryPublicId,
            originalName: image.originalName,
          })),
        );
      }

      return { ...rest, images: imagesWithUrl };
    });

    return response;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);

    const { images, ...rest } = product;

    let imagesWithUrl;
    if (images) {
      imagesWithUrl = createCloudinaryImageUrl(
        images.map((image) => ({
          id: image.id,
          publicId: image.cloudinaryPublicId,
          originalName: image.originalName,
        })),
      );
    }

    return { ...rest, images: imagesWithUrl };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 10, {}))
  async update(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const { deletedImages, ...rest } = updateProductDto;
    if (!isNil(deletedImages) && !isEmpty(deletedImages)) {
      const deletedImageIds = deletedImages.map((image) => image.id);
      await this.imageService.deleteImages(deletedImageIds);

      const deletedImagesPublicIds = deletedImages.map(
        (deleteImage) => deleteImage.publicId,
      );

      this.imageService.deleteImagesFromCloudinary({
        ids: deletedImagesPublicIds,
      });
    }

    let images: Array<Image & { productId: number }> = [];
    if (files && !isEmpty(files)) {
      try {
        const promises = files.map((file) => {
          if (!validateImageMimeType(file.mimetype)) {
            throw new BadRequestException('Invalid image mime type');
          }

          return this.imageService.uploadImageToCloudinary(
            file.buffer.toString('base64'),
            file.mimetype as ValidMimeType,
          );
        });

        const resImages = await Promise.all(promises);

        images = resImages.map((image, index) => {
          const { asset_id, public_id } = image;

          return {
            originalName: files[index].originalname,
            cloudinaryId: asset_id,
            cloudinaryPublicId: public_id,
            productId: id,
          };
        });
        await this.imageService.createImages(images);
      } catch (err) {
        if (!isEmpty(images)) {
          this.imageService.deleteImagesFromCloudinary({
            ids: images.map((image) => image.cloudinaryPublicId),
          });
        }

        throw new Error('Error occurred while uploading image');
      }
    }

    await this.productsService.update(id, rest);

    const product = await this.productsService.findOne(id);

    const { images: imgs, ...restProd } = product;

    let imagesWithUrl;
    if (imgs) {
      imagesWithUrl = createCloudinaryImageUrl(
        imgs.map((image) => ({
          id: image.id,
          publicId: image.cloudinaryPublicId,
          originalName: image.originalName,
        })),
      );

      return { ...restProd, images: imagesWithUrl };
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
