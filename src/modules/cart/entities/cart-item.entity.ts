import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Table({ tableName: 'cart_items' })
export class CartItem extends Model<CartItem> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare cartId: string;

  @BelongsTo(() => Cart)
  cart!: Cart;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare productId: string;

  @BelongsTo(() => Product)
  product!: Product;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  declare quantity: number;
}
