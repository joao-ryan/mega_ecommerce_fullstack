import { Request, Response } from "express";
import { CartRepository } from "../repositories/CartRepository.js";
import { AddToCartService } from "../services/AddToCartService.js";
import { GetCartService } from "../services/GetCartService.js";
import { RemoveFromCartService } from "../services/RemoveFromCartService.js";

export class CartController {
  async add(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user?.id || req.body.user_id || "usr_guest";
      const { variant_id, product_id, quantity, items } = req.body;

      const cartRepository = new CartRepository();
      const addToCartService = new AddToCartService(cartRepository);

      // Trata tanto adição individual por variant_id quanto sincronização em lote (items)
      if (Array.isArray(items)) {
        for (const item of items) {
          const targetVariant = item.variant_id || item.product_id;
          if (targetVariant) {
            await addToCartService.execute({
              user_id,
              variant_id: targetVariant,
              quantity: Number(item.quantity) || 1,
            });
          }
        }
        return res
          .status(200)
          .json({ message: "Carrinho sincronizado com sucesso!" });
      }

      const targetVariant = variant_id || product_id;
      if (!targetVariant) {
        return res
          .status(400)
          .json({ message: "É necessário fornecer variant_id ou product_id." });
      }

      const item = await addToCartService.execute({
        user_id,
        variant_id: targetVariant,
        quantity: Number(quantity) || 1,
      });

      return res.status(201).json(item);
    } catch (error: any) {
      console.error("Erro no CartController.add:", error);
      return res.status(400).json({
        message: error.message || "Falha ao processar atualização do carrinho.",
      });
    }
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user?.id || "usr_guest";

      const cartRepository = new CartRepository();
      const getCartService = new GetCartService(cartRepository);

      const cart = await getCartService.execute(user_id);

      return res.json(cart || []);
    } catch (error: any) {
      console.error("Erro no CartController.index:", error);
      return res.status(200).json([]);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user?.id || "usr_guest";
      const { id } = req.params;

      const cartRepository = new CartRepository();
      const removeFromCartService = new RemoveFromCartService(cartRepository);

      await removeFromCartService.execute({ id, user_id });

      return res.status(204).send();
    } catch (error: any) {
      console.error("Erro no CartController.delete:", error);
      return res
        .status(400)
        .json({
          message: error.message || "Erro ao remover item do carrinho.",
        });
    }
  }
}
