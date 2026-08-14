import { Request, Response, NextFunction } from "express";
import { ProductsRepository } from "../repositories/ProductsRepository.js";

export class ProductsController {
  async index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const productsRepository = new ProductsRepository();
      const products = await productsRepository.findAll();
      return res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      // Implementação da criação de produto caso utilize
      return res.status(201).json({ message: "Produto criado com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}
