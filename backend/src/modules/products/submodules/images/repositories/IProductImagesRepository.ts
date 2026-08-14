export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
}

export interface IProductImagesRepository {
  create(product_id: string, image_url: string): Promise<ProductImage>;
  findByProductId(product_id: string): Promise<ProductImage[]>;
}
