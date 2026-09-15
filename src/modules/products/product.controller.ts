import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';
import { UserRoles } from '../../enums/user-roles.enum';
import { Public } from '../auth/decorators/is-public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponse } from './dto/get-product.dto';
import { ProductService } from './product.service';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(UserRoles.SELLER)
  async createProduct(@Body() data: CreateProductDto, @Req() req: Request) {
    return this.productService.createProduct(data, req.user.sub);
  }

  @Get('all')
  @Public()
  async getAllProducts(): Promise<ProductResponse[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @Roles(UserRoles.SELLER)
  async getProd(@Param('id') id: string) {
    return this.productService.getProduct(id);
  }

  @Public()
  @Get('slug/:slug')
  async getProdBySlug(@Param('slug') slug: string) {
    return this.productService.getProductBySlug(slug);
  }

  @Delete('id')
  async removeProduct(@Param('id') id: string) {
    return this.productService.excludeProd(id);
  }
}
