import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
  Param,
} from '@nestjs/common';

import type { Request } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProductResponse } from './dto/get-product.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../../enums/user-roles.enum';
import { Public } from '../auth/decorators/is-public.decorator';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(UserRoles.SELLER)
  async createProduct(@Body() data: CreateProductDto, @Req() req: Request) {
    return this.productService.createProduct(data, req.user.sub);
  }

  @Get('all') async getAllProducts(@Query() data: ProductResponse) {
    return this.productService.getAllProducts(data);
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
}
