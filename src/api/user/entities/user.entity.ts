import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { UserCreationAttributes } from '../interfaces/user.interface';

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
}