import { Injectable } from "@nestjs/common";
import { Product } from "./entities/product.entity";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product
  ) {}

  
}