import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';


export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title!: string;


  @IsString()
  @IsOptional()
  slug?: string;


  @IsString()
  @IsNotEmpty()
  description!: string;


  @IsNumber()
  @IsNotEmpty()
  price!: number;


  @IsNumber()
  @IsNotEmpty()
  stock_quantity!: number;


  @IsString()
  @IsOptional()
  sku?: string;


  @IsUUID()
  @IsNotEmpty()
  category_id!: string;


  @IsString()
  @IsOptional()
  image?: string;


  @IsArray()
  @IsOptional()
  images?: string[];


  @IsBoolean()
  @IsOptional()
  is_active?: boolean;


  @IsNumber()
  @IsOptional()
  weight?: number;


  @IsNumber()
  @IsOptional()
  height?: number;


  @IsNumber()
  @IsOptional()
  width?: number;


  @IsNumber()
  @IsOptional()
  length?: number;
}