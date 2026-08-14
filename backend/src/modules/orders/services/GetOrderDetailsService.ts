import { AppError } from "../../../shared/errors/AppError.js";
import { IOrdersRepository, Order } from "../repositories/IOrdersRepository.js";

interface Request {
  order_id: string;
  user_id: string;
}

export class GetOrderDetailsService {
  constructor(private ordersRepository: IOrdersRepository) {}

  async execute({ order_id, user_id }: Request): Promise<Order> {
    const order = await this.ordersRepository.findById(order_id, user_id);

    if (!order) {
      throw new AppError("Pedido não encontrado.", 404);
    }

    return order;
  }
}
