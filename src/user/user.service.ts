import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, avatar } = createUserDto;

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
}