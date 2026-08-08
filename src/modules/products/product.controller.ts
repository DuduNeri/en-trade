import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';

import type { Request } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProductResponse } from './dto/get-product.dto';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() data: CreateProductDto, @Req() req: Request) {

    return this.productService.createProduct(data, req.user.sub);
  }

  @Get('all')
  async getAllProducts(@Query() data: ProductResponse) {
    return this.productService.getAllProducts(data);
  }
}
