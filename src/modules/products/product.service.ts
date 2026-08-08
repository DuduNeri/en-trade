import { CreateProductDto } from './dto/create-product.dto';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectModel } from '@nestjs/sequelize';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,
  ) {}


  async createProduct(
    data: CreateProductDto,
    userId: string,
  ) {
    console.log('USER ID:', userId);

    const product = await this.productRepository.create({
      ...data,
      userId,
    });

    return product;
  }
}