import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { User } from '../../user/entities/user.entity';
import { Product } from './product.entity';

@Table({
  tableName: 'favorites',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId'],
    },
  ],
})
export class Favorite extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare productId: string;



  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @BelongsTo(() => Product, { onDelete: 'CASCADE' })
  product!: Product;
}