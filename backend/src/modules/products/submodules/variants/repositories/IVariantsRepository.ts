export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  promo_price?: number;
  stock: number;
  attributes?: Record<string, any>;
}

export interface CreateVariantDTO {
  product_id: string;
  sku: string;
  price: number;
  promo_price?: number;
  stock: number;
  attributes?: Record<string, any>;
}

export interface IVariantsRepository {
  create(data: CreateVariantDTO): Promise<ProductVariant>;
  findBySku(sku: string): Promise<ProductVariant | null>;
  findByProductId(product_id: string): Promise<ProductVariant[]>;
  updateStock(id: string, newStock: number): Promise<void>;
}
