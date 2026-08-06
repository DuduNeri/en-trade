import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { UserCreationAttributes } from '../interfaces/user.interfaces';
import { UserRoles } from './../../../enums/user-roles.enum';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User, UserCreationAttributes> {
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
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare avatar?: string;

  @AllowNull(false)
  @Default(UserRoles.USER)
  @Column({
    type: DataType.ENUM(...Object.values(UserRoles)),
  })
  declare role: UserRoles;

  override toJSON(): any {
    const { password, ...values } = this.get();
    return values;
  }
}
