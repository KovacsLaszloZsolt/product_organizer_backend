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
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard';
import { ProductService } from 'src/product/product.service';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('api/category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const deletedCategory = await this.categoryService.findDeletedCategory({
        name: createCategoryDto.name,
      });

      if (!isEmpty(deletedCategory)) {
        return await this.categoryService.update(deletedCategory[0].id, {
          deleted_at: null,
        });
      }

      const newCategory = await this.categoryService.create(createCategoryDto);
      return newCategory;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BadRequestException('Category already exists');
      }
    }
  }

  @Get()
  async getAllCategory() {
    return await this.categoryService.findAll();
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: CreateCategoryDto,
  ) {
    try {
      const category = await this.categoryService.findOne({ id });
      if (!category) {
        throw new BadRequestException('Category not found');
      }

      const updatedCategory = await this.categoryService.update(
        id,
        updateCategoryDto,
      );
      return updatedCategory;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BadRequestException(
          'Category with requested name already exists',
        );
      }
      throw err;
    }
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const categoryProducts = await this.productService.findAll({
      categoryId: id,
    });

    if (!isEmpty(categoryProducts)) {
      throw new BadRequestException(
        'Category with product not possible to be removed',
      );
    }

    return await this.categoryService.delete(+id);
  }
}
