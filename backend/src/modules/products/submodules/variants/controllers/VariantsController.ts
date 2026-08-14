import { Request, Response } from "express";
import { VariantsRepository } from "../repositories/VariantsRepository.js";
import { CreateVariantService } from "../services/CreateVariantService.js";
import { UpdateStockService } from "../services/UpdateStockService.js";

export class VariantsController {
  async create(req: Request, res: Response): Promise<Response> {
    const { product_id, sku, price, promo_price, stock, attributes } = req.body;

    const variantsRepository = new VariantsRepository();
    const createVariantService = new CreateVariantService(variantsRepository);

    const variant = await createVariantService.execute({
      product_id,
      sku,
      price,
      promo_price,
      stock,
      attributes,
    });

    return res.status(201).json(variant);
  }

  async updateStock(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { stock } = req.body;

    const variantsRepository = new VariantsRepository();
    const updateStockService = new UpdateStockService(variantsRepository);

    await updateStockService.execute({ variant_id: id, stock });

    return res.json({ message: "Estoque atualizado com sucesso!" });
  }
}
