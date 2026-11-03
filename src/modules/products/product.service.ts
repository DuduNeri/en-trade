import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthService } from '../auth/services/auth.service';
import { CartItem } from '../cart/entities/cart-item.entity';
import { UploadService } from '../upload/upload.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponse } from './dto/get-product.dto';
import { Favorite } from './entities/favorite.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,
    @InjectModel(CartItem)
    private readonly cartItemRepository: typeof CartItem,
    @InjectModel(Favorite)
    private readonly favoriteRepository: typeof Favorite,
    private readonly authService: AuthService,
    private readonly uploadService: UploadService,

  ) { }

  private toProductResponse(product: Product): ProductResponse {
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
  }
  //criar produto
  async createProduct(
    data: CreateProductDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    const upload = await this.uploadService.saveFile(file);

    console.log(upload)

    try {
      return await this.productRepository.create({
        ...data,
        userId,
        image: upload.url,
      });

    } catch (error) {
      await this.uploadService.deleteFile(upload.key).catch(() => null);
      throw error;
    }
  }
  //adicionar aos favoritos
  async addToFavorites(userId: string, productId: string): Promise<ProductResponse> {
    const product = await this.productRepository.findByPk(productId, {
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    console.log(product)

    await this.favoriteRepository.findOrCreate({
      where: { userId, productId },
    });

    return this.toProductResponse(product);
  }
  //buscar favoritos de um usuário
  async getFavorities(userId: string): Promise<ProductResponse[]> {
    const favorites = await this.favoriteRepository.findAll({
      where: { userId },
      include: [
        {
          association: 'product',
          include: [
            {
              association: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    console.log(favorites)
    console.log(userId)

    if (favorites.length == 0) {
      throw new NotFoundException("Nenhum produto encontrado nos favoritos")
    }

    if (!favorites) {
      throw new NotFoundException("Nenhum produto encontrado")
    }

    return favorites.map((fav) => this.toProductResponse(fav.product));
  }
  //remover dos favoritos
  async removeFavorites(userId: string, productId: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, productId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado');
    }

    await favorite.destroy();

    return { message: 'Produto removido' };
  }
  //trazer todos os produtos
  async getAllProducts(): Promise<ProductResponse[]> {
    const products = await this.productRepository.findAll({
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    console.log(products)

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
  //pegar um produto específico pelo ID
  async getProduct(id: string) {
    const response = await this.productRepository.findByPk(id);
    if (!response) {
      throw new NotFoundException('Product not found');
    }

    console.log(response)

    return response;
  }
  //buscar produto pelo slug
  async getProductBySlug(slug: string): Promise<ProductResponse> {
    const prod = await this.productRepository.findOne({
      where: { slug },
    });

    if (!prod) {
      throw new NotFoundException('Product not found');
    }

    console.log(prod)

    return prod.toJSON() as ProductResponse;
  }
  //decrementar estoque
  async decreaseStock(id: string, quantity: number) {
    const prod = await this.productRepository.findByPk(id);

    if (!prod) {
      throw new NotFoundException('Product not found');
    }

    if (prod.stock_quantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    console.log('Preco do produto', prod.price)

    await prod.decrement('stock_quantity', { by: quantity });
    return { message: 'Stock updated successfully' };
  }
  //deletar produto
  async deleteProd(id: string) {
    const prod = await this.productRepository.findByPk(id);
    if (!prod) {
      throw new NotFoundException('Product not found');
    }

    console.log(prod)

    await prod.destroy();
    return {
      message: 'Product destroyed',
    };
  }
  //deletar todos os produtos
  async deleteAllProds() {
    try {
      await this.cartItemRepository.destroy({
        where: {},
      });

      await this.productRepository.destroy({
        where: {},
      });

      return {
        message: 'Products deleted successfully',
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}