import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateUserSellerDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  storeName!: string;

  @IsString()
  @IsNotEmpty()
  cnpj!: string;
}