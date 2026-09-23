import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { TestController } from './test.connect.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => AuthModule),
    UploadModule, // <- novo
  ],
  controllers: [UserController, TestController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}