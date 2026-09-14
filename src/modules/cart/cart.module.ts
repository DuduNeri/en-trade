import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Product } from '../products/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [SequelizeModule.forFeature([Cart, CartItem, Product, User])],

  controllers: [CartController],

  providers: [CartService],
})
export class CartModule {}
