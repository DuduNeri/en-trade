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
import { AuthGuard } from '../auth/guards/auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-item.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetCartDto } from './dto/get-cart.dto';
import { Cart } from './entities/cart.entity';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Post('items')
  addItem(@Req() req: any, @Body() dto: AddCartItemDto) {
    const userId = req.user.sub;
    console.log('req.user:', req.user);
    return this.cartService.addItem(userId, dto);
  }

  @Get('all/items')
  async getAllCarts(@Req() req: any): Promise<Cart[]> {
    return this.cartService.getAllCarts(req.user.sub);
  }

  @Get(':id')
  getCartControll(@Param('id') id: string): Promise<GetCartDto> {
    return this.cartService.getCart(id);
  }

  @Delete('remove/:cartId/:productId')
  removeItem(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItemByCart(cartId, productId);
  }
}
