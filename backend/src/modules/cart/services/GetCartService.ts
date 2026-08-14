import { ICartRepository, CartItem } from "../repositories/ICartRepository.js";

interface CartSummary {
  items: CartItem[];
  total_items: number;
  subtotal: number;
}

export class GetCartService {
  constructor(private cartRepository: ICartRepository) {}

  async execute(user_id: string): Promise<CartSummary> {
    const items = await this.cartRepository.getUserCart(user_id);

    // Calcula o total de itens e o valor total do carrinho automaticamente
    const total_items = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => {
      const itemPrice = item.promo_price
        ? Number(item.promo_price)
        : Number(item.price || 0);
      return acc + itemPrice * item.quantity;
    }, 0);

    return {
      items,
      total_items,
      subtotal,
    };
  }
}
