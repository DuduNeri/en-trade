import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { CreateProductInterface } from '../interfaces/product.interface';
import { User } from '../../user/entities/user.entity';

@Table({
  tableName: 'products',
})
export class Product extends Model<Product, CreateProductInterface> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;


  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare slug?: string;


  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;


  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;


  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare stock_quantity: number;


  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare sku?: string;


  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare category_id: string;


  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare image?: string;


  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare images?: string[];


  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare is_active: boolean;


  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare weight?: number;


  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare height?: number;


  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare width?: number;


  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare length?: number;


  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;


  @BelongsTo(() => User)
  declare user: User;
}