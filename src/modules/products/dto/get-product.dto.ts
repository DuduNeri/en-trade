import { Product } from './../entities/product.entity';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProductResponse {
  id!: string;
  userId!: string;
  title!: string;
  slug!: string;
  description!: string;
  price!: number;
  stock_quantity!: number;
  sku?: string;
  category_id!: string;
  image?: string;
  images?: string[];
  is_active!: boolean;
}