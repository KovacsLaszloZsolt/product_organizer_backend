import { Injectable } from '@nestjs/common';
import cloudinary from 'cloudinary/cloudinary.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidMimeType } from 'src/utils/validateImageMimeType';
import { CreateImageDto, DeleteImageIdsDto } from './dto';
import { CreateImageFolderDto } from './dto/create-image-folder.dto';
import { DeleteImageFolderDto } from './dto/delete-image-folder.dto';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}
  uploadImageToCloudinary(base64Url: string, mimeType: ValidMimeType) {
    return cloudinary.uploader.upload(`data:${mimeType};base64,${base64Url}`, {
      phash: true,
      sign_url: true,
      resource_type: 'image',
      transformation: {
        width: 1280,
        crop: 'scale',
        fetch_format: 'auto',
        quality: 'auto',
      },
    });
  }

  deleteImagesFromCloudinary(publicIds: DeleteImageIdsDto) {
    return cloudinary.api.delete_resources(publicIds.ids);
  }

  findImagesByProductId(id: number) {
    return this.prisma.image.findMany({ where: { productId: id } });
  }

  createImages(images: CreateImageDto[]) {
    return this.prisma.image.createMany({
      data: images,
    });
  }

  deleteImages(ids: number[]) {
    return this.prisma.image.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  findImagesFolders() {
    return this.prisma.imagesFolder.findMany({
      where: {
        deleted_at: null,
      },
    });
  }

  findImagesFoldersByIds(ids: number[]) {
    return this.prisma.imagesFolder.findMany({
      where: { id: { in: ids }, deleted_at: null },
      orderBy: { name: 'asc' },
    });
  }

  createImageFolder(createImageFolder: CreateImageFolderDto) {
    return this.prisma.imagesFolder.create({ data: createImageFolder });
  }

  deleteImagesFolder(deleteImageFolder: DeleteImageFolderDto) {
    return this.prisma.imagesFolder.delete({
      where: { id: deleteImageFolder.id },
    });
  }
}
