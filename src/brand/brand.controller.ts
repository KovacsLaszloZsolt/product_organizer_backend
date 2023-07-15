import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isEmpty } from 'lodash';
import { Roles } from 'src/auth/decorator';
import { RolesGuard } from 'src/auth/guard';
import { ProductService } from 'src/product/product.service';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('api/brand')
export class BrandController {
  constructor(
    private brandService: BrandService,
    private productService: ProductService,
  ) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    try {
      const deletedBrand = await this.brandService.findDeletedBrand({
        name: createBrandDto.name,
      });

      if (!isEmpty(deletedBrand)) {
        return await this.brandService.update(deletedBrand[0].id, {
          deleted_at: null,
        });
      }

      const newBrand = await this.brandService.create(createBrandDto);

      return newBrand;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BadRequestException('Brand already exists');
      }
    }
  }

  @Get()
  async getAllBrand() {
    return await this.brandService.findAll();
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: CreateBrandDto,
  ) {
    try {
      const brand = await this.brandService.findOne({ id });

      if (!brand) {
        throw new BadRequestException('Brand not found');
      }

      const updatedBrand = await this.brandService.update(id, updateBrandDto);

      return updatedBrand;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BadRequestException(
          'Brand with requested name already exists',
        );
      }
      throw err;
    }
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const brandProducts = await this.productService.findAll({
      brandId: [id],
    });

    if (!isEmpty(brandProducts)) {
      throw new BadRequestException(
        'Brand with product not possible to be removed',
      );
    }

    return await this.brandService.delete(+id);
  }
}
