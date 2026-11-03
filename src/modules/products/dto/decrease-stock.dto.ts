import { IsInt, Min } from 'class-validator';

export class DecreaseStockDto {
  @IsInt()
  @Min(1)
  quantity!: number;
}