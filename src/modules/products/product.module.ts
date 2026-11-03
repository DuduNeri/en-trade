import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { AuthModule } from '../auth/auth.module';
import { UploadService } from '../upload/upload.service';
import { Favorite } from './entities/favorite.entity';

@Module({
  imports: [SequelizeModule.forFeature([Product, CartItem, Favorite]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService, UploadService],
})
export class ProductModule {}