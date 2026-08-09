import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: Partial<User>): Promise<{ token: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  sanitizeUser(user: User): Partial<User> {
    const plainUser =
      typeof user.toJSON === 'function'
        ? user.toJSON()
        : { ...user };

    const { password: _, ...userWithoutPassword } = plainUser;

    return userWithoutPassword;
  }
}