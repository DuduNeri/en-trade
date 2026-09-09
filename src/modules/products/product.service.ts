import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponse } from './dto/get-product.dto';
import { Product } from './entities/product.entity';

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

  async getAllProducts(): Promise<ProductResponse[]> {
    const products = await this.productRepository.findAll();

    if (products.length === 0) {
      throw new NotFoundException('Products empty');
    }

    return products.map((product) => ({
      ...product,
      slug: product.slug ?? '',
    }));
  }

  async getProduct(id: string) {
    const response = await this.productRepository.findByPk(id);
    return response;
  }

  async getProductBySlug(slug: string): Promise<ProductResponse> {
    const prod = await this.productRepository.findOne({
      where: { slug },
    });

    if (!prod) {
      throw new NotFoundException('Product not found');
    }

    return prod.toJSON() as ProductResponse;
  }

  async excludeProd(id: string) {
    const prod = await this.productRepository.findByPk(id);

    if (!prod) {
      throw new NotFoundException('Product not found');
    }

    await prod.destroy();
    return { message: 'Product deleted successfully' };
  }
}
