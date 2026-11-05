import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { UserRoles } from '../../enums/user-roles.enum';
import { Public } from '../auth/decorators/is-public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { DecreaseStockDto } from './dto/decrease-stock.dto';
import { ProductResponse } from './dto/get-product.dto';
import { ProductService } from './product.service';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  //criar produto
  @Post('create')
  @Roles(UserRoles.SELLER)
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() data: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) throw new BadRequestException('A imagem é obrigatória');

    return this.productService.createProduct(data, req.user.sub, file);
  }
  //adicionar aos favoritos
  @Post(':id/favorite')
  addToFavorites(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.productService.addToFavorites(req.user.sub, id);
  }
  //buscar favoritos de um usuário
  @Get('favorites')
  getFavorites(@Req() req: Request) {
    return this.productService.getFavorities(req.user.sub);
  }
  //trazer todos os produtos
  @Get('all')
  @Public()
  async getAllProducts(): Promise<ProductResponse[]> {
    return this.productService.getAllProducts();
  }
  //buscar produto pelo slug
  @Public()
  @Get('slug/:slug')
  async getProdBySlug(@Param('slug') slug: string) {
    return this.productService.getProductBySlug(slug);
  }
  //pegar um produto específico pelo ID
  @Get(':id')
  @Roles(UserRoles.SELLER)
  async getProd(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.getProduct(id);
  }
  //decrementar estoque
  @Patch(':id/decrease-stock')
  async decreaseStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DecreaseStockDto,
  ) {
    return this.productService.decreaseStock(id, dto.quantity);
  }
  //remover dos favoritos
  @Delete(':id/favorites')
  async removeFavorites(
    @Param('id', ParseUUIDPipe) productId: string,
    @Req() req: Request,
  ) {
    return this.productService.removeFavorites(req.user.sub, productId);
  }
  //deletar todos os produtos
  @Delete('all')
  async destroyProds() {
    return this.productService.deleteAllProds();
  }
  //deletar produto
  @Delete(':id')
  async deleteProdForEver(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.deleteProd(id);
  }
}