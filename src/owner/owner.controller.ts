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
import { UpdateOwnerDto } from './dto';
import { CreateOwnerDto } from './dto/createOwner.dto';
import { OwnerService } from './owner.service';

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
      const deletedOwner = await this.ownerService.findAll({
        name: createOwnerDto.name,
        NOT: { deleted_at: null },
      });

      if (!isEmpty(deletedOwner)) {
        return await this.ownerService.update(deletedOwner[0].id, {
          deleted_at: null,
        });
      }

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
    return await this.ownerService.findAll({ deleted_at: null });
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOwnerDto: UpdateOwnerDto,
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
    const ownerProducts = await this.productsService.findAll({ ownerId: [id] });

    if (ownerProducts.length) {
      return new BadRequestException(
        'Owner with product not possible to be removed',
      );
    }

    return await this.ownerService.delete(+id);
  }
}
