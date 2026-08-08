import { CreateProductDto } from './dto/create-product.dto';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductResponse } from './dto/get-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,
  ) {}

  async createProduct(data: CreateProductDto, userId: string) {

    const product = await this.productRepository.create({
      ...data,
      userId,
    });

    return product;
  }

  async getAllProducts(data: ProductResponse) {
    const products = await this.productRepository.findAll();
    return products;
  }
}
