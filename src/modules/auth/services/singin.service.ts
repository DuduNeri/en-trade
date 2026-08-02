import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { SignInDto } from '../dtos/singin.dto';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class SignInService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async singIn(data: SignInDto): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.userService.comparePassword(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: this.configService.getOrThrow<string>('JWT_SECRET') },
    );

    const plainUser = user.toJSON ? user.toJSON() : { ...user };
    const { password: _, ...userWithoutPassword } = plainUser;

    return { token, user: userWithoutPassword };
  }
}