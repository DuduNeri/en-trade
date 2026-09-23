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
    const products = await this.productRepository.findAll({
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (products.length === 0) {
      throw new NotFoundException('Products empty');
    }
    return products.map((product) => {
      const data = product.toJSON();

      return {
        id: data.id,
        userId: data.userId,
        title: data.title,
        slug: data.slug ?? '',
        description: data.description,
        price: data.price,
        stock_quantity: data.stock_quantity,
        sku: data.sku,
        category_id: data.category_id,
        is_active: data.is_active,
        image: data.image,
        user: data.user,
      };
    });
  }

  async getProduct(id: string) {
    const response = await this.productRepository.findByPk(id);
    if (!response) {
      throw new NotFoundException('Product not found');
    }
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
