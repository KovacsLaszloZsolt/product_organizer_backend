import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  FindAllProductDto,
  UpdateProductDto,
} from './dto/index.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { OwnerService } from 'src/owner/owner.service';
import { CategoryService } from 'src/category/category.service';
import { isEmpty } from 'lodash';

@Controller('api/product')
export class ProductController {
  constructor(
    private readonly productsService: ProductService,
    private readonly ownerService: OwnerService,
    private readonly categoryService: CategoryService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() params?: FindAllProductDto) {
    const filter = {} as Record<string, unknown>;

    const { owner, category } = params ?? {};
    if (owner) {
      const selectedOwner = await this.ownerService.findAll({ id: owner });

      if (isEmpty(selectedOwner)) {
        throw new BadRequestException('Invalid owner id');
      }

      filter.ownerId = owner;
    }

    if (category) {
      const selectedCategory = await this.categoryService.findAll({
        id: category,
      });

      if (isEmpty(selectedCategory)) {
        throw new BadRequestException('Invalid category id');
      }

      filter.categoryId = category;
    }

    return await this.productsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
