import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module'; 
import { AuthController } from './auth.controller';
import { SignInService } from './services/singin.service'; 
@Module({
  imports: [
    UserModule,
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
  providers: [SignInService],
  exports: [SignInService, JwtModule],
})
export class AuthModule {}