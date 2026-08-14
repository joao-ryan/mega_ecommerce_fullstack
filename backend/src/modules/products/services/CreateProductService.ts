import { AppError } from "../../../shared/errors/AppError.js";
import {
  IProductsRepository,
  CreateProductDTO,
  Product,
} from "../repositories/IProductsRepository.js";

export class CreateProductService {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    if (!data.name || !data.slug) {
      throw new AppError("Nome e Slug do produto são obrigatórios.");
    }

    const productExists = await this.productsRepository.findBySlug(data.slug);

    if (productExists) {
      throw new AppError("Já existe um produto cadastrado com este slug.");
    }

    return await this.productsRepository.create(data);
  }
}
