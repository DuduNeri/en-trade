import { Module, forwardRef } from '@nestjs/common'; // 1. Importe o forwardRef
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { SignInService } from './services/singin.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule), 
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [SignInService, AuthService],
  exports: [SignInService, AuthService, JwtModule],
})
export class AuthModule {}