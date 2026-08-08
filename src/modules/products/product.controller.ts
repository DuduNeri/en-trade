import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';


@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}


  @Post()
  async createProduct(
    @Body() data: CreateProductDto,
    @Req() req: Request,
  ) {

    console.log('USER:', req.user);

    return this.productService.createProduct(
      data,
      req.user.sub,
    );
  }
}