import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

// 1. DTO para cada item individual dentro do array
export class CartItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

// 2. DTO principal do Carrinho
export class GetCartDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto dentro do array
  @Type(() => CartItemDto) // Converte os objetos puros do JSON para a classe CartItemDto
  items!: CartItemDto[];
}
