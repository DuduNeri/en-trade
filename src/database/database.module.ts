import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../modules/user/entities/user.entity';
import { Product } from '../modules/products/entities/product.entity';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',

        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),

        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_DATABASE'),

        autoLoadModels: true,

        models: [
          User,
          Product,
        ],

        logging: console.log,

        synchronize: false,
      }),
    }),
  ],

  exports: [SequelizeModule],
})
export class DatabaseModule {}