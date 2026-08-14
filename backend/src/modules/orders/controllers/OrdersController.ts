import { Request, Response } from "express";
import { OrdersRepository } from "../repositories/OrdersRepository.js";
import { CartRepository } from "../../cart/repositories/CartRepository.js";
import { CreateOrderService } from "../services/CreateOrderService.js";
import { GetOrderDetailsService } from "../services/GetOrderDetailsService.js";

export class OrdersController {
  async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user!.id;

    const ordersRepository = new OrdersRepository();
    const cartRepository = new CartRepository();
    const createOrderService = new CreateOrderService(
      ordersRepository,
      cartRepository,
    );

    const order = await createOrderService.execute(user_id);

    return res.status(201).json(order);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user!.id;
    const { id } = req.params;

    const ordersRepository = new OrdersRepository();
    const getOrderDetails = new GetOrderDetailsService(ordersRepository);

    const order = await getOrderDetails.execute({ order_id: id, user_id });

    return res.json(order);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user!.id;

    const ordersRepository = new OrdersRepository();
    const orders = await ordersRepository.findByUser(user_id);

    return res.json(orders);
  }
}
