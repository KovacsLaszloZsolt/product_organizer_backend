import { BadRequestException } from '@nestjs/common/';
import { isEmpty } from 'lodash';
import { BrandService } from 'src/brand/brand.service';
import { CategoryService } from 'src/category/category.service';
import { ImageService } from 'src/image/image.service';
import { OwnerService } from 'src/owner/owner.service';
import { FindAllProductDto } from 'src/product/dto/index.dto';

export const setFilters = async (
  services: {
    brandService: BrandService;
    ownerService: OwnerService;
    categoryService: CategoryService;
    imageService: ImageService;
  },
  filters?: Omit<FindAllProductDto, 'page' | 'search'>,
) => {
  const filter = {} as Omit<FindAllProductDto, 'page' | 'search'>;

  const { ownerId, categoryId, status, imagesFolderId, brandId } =
    filters ?? ({} as Omit<FindAllProductDto, 'page' | 'search'>);

  if (brandId) {
    const brands = await services.brandService.findAllByIds(
      brandId.filter((id) => id !== -1),
    );

    if (isEmpty(brands) && !brandId.includes(-1)) {
      throw new BadRequestException('Invalid brand id');
    }

    filter.brandId = brandId;
  }

  if (ownerId) {
    const selectedOwner = await services.ownerService.findAllByIds(
      ownerId.filter((id) => id === -1),
    );

    if (isEmpty(selectedOwner) && !ownerId.includes(-1)) {
      throw new BadRequestException('Invalid owner id');
    }

    filter.ownerId = ownerId;
  }

  if (categoryId) {
    const selectedCategory = await services.categoryService.findAllByIds(
      categoryId.filter((id) => id === -1),
    );

    if (isEmpty(selectedCategory) && !categoryId.includes(-1)) {
      throw new BadRequestException('Invalid category id');
    }

    filter.categoryId = categoryId;
  }

  if (status || !isEmpty(status)) {
    filter.status = status;
  }

  if (imagesFolderId) {
    const selectedImagesFolder =
      await services.imageService.findImagesFoldersByIds(
        imagesFolderId.filter((id) => id === -1),
      );

    if (isEmpty(selectedImagesFolder) && !imagesFolderId.includes(-1)) {
      throw new BadRequestException('Invalid image folder id');
    }

    filter.imagesFolderId = imagesFolderId;
  }

  return filter;
};
