import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorator';
import { RolesGuard } from 'src/auth/guard';
import {
  ValidMimeType,
  validateImageMimeType,
} from 'src/utils/validateImageMimeType';
import { CreateImageFolderDto } from './dto/create-image-folder.dto';
import { DeleteImageFolderDto } from './dto/delete-image-folder.dto';
import { ImageService } from './image.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('api/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, {}))
  async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
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

      const images = await Promise.all(promises);

      const response = images.map((image) => {
        const { asset_id, public_id } = image;

        return { asset_id, public_id };
      });

      return response;
    } catch (err) {
      throw err;
    }
  }

  @Get('/folder')
  async getFolders() {
    return this.imageService.findImagesFolders();
  }

  @Post('/folder')
  async postFolder(@Body() createImageFolderDto: CreateImageFolderDto) {
    try {
      const data = await this.imageService.createImageFolder(
        createImageFolderDto,
      );
      return data;
    } catch (err) {
      throw new Error('Error occurred while creating image folder');
    }
  }

  @Delete('/folder')
  async deleteFolder(@Body() deleteImageFolderDto: DeleteImageFolderDto) {
    return this.imageService.deleteImagesFolder(deleteImageFolderDto);
  }
}
