import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRoles } from '../../enums/user-roles.enum';
import { Product } from '../products/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { AddCartItemDto } from './dto/add-item.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private readonly cartRepository: typeof Cart,
    @InjectModel(CartItem)
    private readonly cartItemRepository: typeof CartItem,
    @InjectModel(Product)
    private readonly productRepository: typeof Product,
    @InjectModel(User)
    private readonly userEntity: typeof User,
  ) {}

  async create(createCartDto: CreateCartDto) {
    try {
      const existingCart = await this.cartRepository.findOne({
        where: { userId: createCartDto.userId },
      });

      if (existingCart) {
        throw new ConflictException('User already has a cart');
      }

      const newCart = await this.cartRepository.create(createCartDto as any, {
        include: [CartItem],
      });
      return newCart;
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create cart: ${error.message}`,
      );
    }
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    try {
      const product = await this.productRepository.findByPk(dto.productId);

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (product.stock_quantity < dto.quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${product.stock_quantity}`,
        );
      }

      let cart = await this.cartRepository.findOne({
        where: { userId },
      });

      if (!cart) {
        cart = await this.cartRepository.create({ userId } as any);
      }

      const existingItem = await this.cartItemRepository.findOne({
        where: {
          cartId: cart.id,
          productId: dto.productId,
        },
      });

      if (existingItem) {
        existingItem.quantity += dto.quantity;
        await existingItem.save();
      } else {
        await this.cartItemRepository.create({
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        } as any);
      }

      product.stock_quantity -= dto.quantity;
      await product.save();

      return this.getCart(cart.id);
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to add item to cart: ${error.message}`,
      );
    }
  }

  async getCart(id: string): Promise<Cart> {
    try {
      const cart = await this.cartRepository.findByPk(id, {
        include: [
          {
            association: 'items',
            include: [
              {
                association: 'product',
              },
            ],
          },
          {
            association: 'user',
            attributes: {
              exclude: ['password', 'createdAt', 'updatedAt'],
            },
          },
        ],
      });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      return cart;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve cart: ${error.message}`,
      );
    }
  }

  async removeItemByCart(cartId: string, productId: string) {
    try {
      const prod = await this.cartItemRepository.findOne({
        where: {
          cartId,
          productId,
        },
      });
      if (!prod) {
        throw new NotFoundException('Cart not found');
      }
      await prod.destroy();
      return {
        message: 'Item removed from cart',
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to remove item: ${error.message}`,
      );
    }
  }

  async getAllCarts(userId: string): Promise<Cart[]> {
    try {
      const user = await this.userEntity.findByPk(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.role !== UserRoles.ADMIN) {
        throw new ForbiddenException(
          'Você não tem permissão para acessar esse recurso',
        );
      }
      return await this.cartRepository.findAll({
        include: [
          {
            association: 'items',
          },
          {
            association: 'user',
            attributes: ['id', 'name', 'email', 'avatar', 'role'],
          },
        ],
      });
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to retrieve carts: ${error.message}`,
      );
    }
  }
}
