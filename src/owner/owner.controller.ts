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
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard';
import { CreateOwnerDto } from './dto/createOwner.dto';
import { OwnerService } from './owner.service';
import { ProductService } from 'src/product/product.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('api/owner')
export class OwnerController {
  constructor(
    private readonly ownerService: OwnerService,
    private readonly productsService: ProductService,
  ) {}

  @Post()
  async create(@Body() createOwnerDto: CreateOwnerDto) {
    try {
      const newOwner = await this.ownerService.create(createOwnerDto);
      return newOwner;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BadRequestException('Owner already exists');
      }
    }
  }

  @Get('')
  async getAllOwner() {
    return await this.ownerService.findAll();
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOwnerDto: CreateOwnerDto,
  ) {
    try {
      const owner = await this.ownerService.findOne({ id });
      if (!owner) {
        throw new BadRequestException('Owner not found');
      }

      const updatedOwner = await this.ownerService.update(id, updateOwnerDto);
      return updatedOwner;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BadRequestException(
          'Owner with requested name already exists',
        );
      }
      throw err;
    }
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const ownerProducts = await this.productsService.findAll({ ownerId: id });

    if (ownerProducts.length) {
      return new BadRequestException(
        'Owner with product not possible to be removed',
      );
    }

    return await this.ownerService.delete(+id);
  }
}
