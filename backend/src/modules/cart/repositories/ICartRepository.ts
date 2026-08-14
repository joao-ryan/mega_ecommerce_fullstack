export interface CartItem {
  id: string;
  user_id: string;
  variant_id: string;
  quantity: number;
  product_name?: string;
  sku?: string;
  price?: number;
  promo_price?: number;
  attributes?: any;
}

export interface AddToCartDTO {
  user_id: string;
  variant_id: string;
  quantity: number;
}

export interface ICartRepository {
  findByUserAndVariant(
    user_id: string,
    variant_id: string,
  ): Promise<CartItem | null>;
  addItem(data: AddToCartDTO): Promise<CartItem>;
  updateQuantity(id: string, quantity: number): Promise<void>;
  getUserCart(user_id: string): Promise<CartItem[]>;
  removeItem(id: string, user_id: string): Promise<void>;
  clearCart(user_id: string): Promise<void>;
}
