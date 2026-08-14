import { AppError } from "../../../shared/errors/AppError.js";
import { ICartRepository } from "../../cart/repositories/ICartRepository.js";
import { IOrdersRepository, Order } from "../repositories/IOrdersRepository.js";

export class CreateOrderService {
  constructor(
    private ordersRepository: IOrdersRepository,
    private cartRepository: ICartRepository,
  ) {}

  async execute(user_id: string): Promise<Order> {
    // 1. Busca os itens do carrinho do usuário
    const cartItems = await this.cartRepository.getUserCart(user_id);

    if (cartItems.length === 0) {
      throw new AppError("O carrinho está vazio para fechar um pedido.");
    }

    // 2. Mapeia itens congelando os preços e calcula total
    let total_amount = 0;
    const orderItems = cartItems.map((item) => {
      const price = item.promo_price
        ? Number(item.promo_price)
        : Number(item.price || 0);
      total_amount += price * item.quantity;

      return {
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: price,
      };
    });

    // 3. Cria o pedido via Repositório (com transação SQL)
    const order = await this.ordersRepository.create({
      user_id,
      total_amount,
      items: orderItems,
    });

    // 4. Limpa o carrinho após fechar o pedido
    await this.cartRepository.clearCart(user_id);

    return order;
  }
}
