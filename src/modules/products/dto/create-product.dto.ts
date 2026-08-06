import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEmail()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  price!: number;

  @IsString()
  @IsOptional()
  image?: string;
}
