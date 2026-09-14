import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany, // <--- 1. Importe o HasMany
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { User } from '../../user/entities/user.entity';
import { CreateCartInterface } from '../interfaces/cart.interface';
import { CartItem } from './cart-item.entity'; // <--- 2. Importe a entidade CartItem

@Table({
  tableName: 'carts',
})
export class Cart extends Model<Cart, CreateCartInterface> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => CartItem)
  declare items: CartItem[];
}
