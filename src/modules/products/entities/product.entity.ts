import { Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreateProductInterface } from '../interfaces/product.interface';

@Table({ tableName: 'products' })
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
    allowNull: false,
  })
  declare description: string;
  
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare image?: string;
}