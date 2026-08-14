import { Request, Response } from "express";
import { CartRepository } from "../repositories/CartRepository.js";
import { AddToCartService } from "../services/AddToCartService.js";
import { GetCartService } from "../services/GetCartService.js";
import { RemoveFromCartService } from "../services/RemoveFromCartService.js";

export class CartController {
  async add(req: Request, res: Response): Promise<Response> {
    const user_id = req.user!.id; // Pego automaticamente via Token JWT
    const { variant_id, quantity } = req.body;

    const cartRepository = new CartRepository();
    const addToCartService = new AddToCartService(cartRepository);

    const item = await addToCartService.execute({
      user_id,
      variant_id,
      quantity: quantity || 1,
    });

    return res.status(201).json(item);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user!.id;

    const cartRepository = new CartRepository();
    const getCartService = new GetCartService(cartRepository);

    const cart = await getCartService.execute(user_id);

    return res.json(cart);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const user_id = req.user!.id;
    const { id } = req.params;

    const cartRepository = new CartRepository();
    const removeFromCartService = new RemoveFromCartService(cartRepository);

    await removeFromCartService.execute({ id, user_id });

    return res.status(204).send();
  }
}
