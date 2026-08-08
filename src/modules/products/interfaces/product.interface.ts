export interface CreateProductInterface {
  id?: string;

  title: string;
  slug?: string;

  description: string;

  price: number;

  stock_quantity: number;

  sku?: string;

  category_id: string;

  image?: string;

  images?: string[];

  is_active?: boolean;

  weight?: number;
  height?: number;
  width?: number;
  length?: number;

  userId: string;
}