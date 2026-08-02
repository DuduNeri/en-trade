import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { GetUsersDto } from './dto/get-users.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, avatar } = createUserDto;

    if (password.length < 6) {
      throw new ConflictException('Password must be at least 6 characters long');
    }

    const userExist = await this.userModel.findOne({ where: { email } });
    if (userExist) {
      throw new ConflictException('Email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return userWithoutPassword;
  }

  async findByUser(id: string) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async findAllUsers(data: GetUsersDto) {
    const { page = 1, limit = 10 } = data;
    const offset = (page - 1) * limit;

    const { rows: users, count: total } = await this.userModel.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    const formattedUsers = users.map(
      (user) => new UserResponseDto(user.toJSON()),
    );

    return {
      data: formattedUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}