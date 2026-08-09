import { CreateProductDto } from './dto/create-product.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductResponse } from './dto/get-product.dto';
import { throwError } from 'rxjs';

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

    if (products.length == 0) {
      throw new NotFoundException('Nenhum produto encontrado');
    }
    return products;
  }

  async getProduct(id: string) {
    const response = await this.productRepository.findByPk(id);
    return response;
  }

    // async getProductTitle(title: ProductResponse){
    //   const 
    // }
}
