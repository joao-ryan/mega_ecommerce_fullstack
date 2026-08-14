import { AppError } from "../../../../../shared/errors/AppError.js";
import { IVariantsRepository } from "../repositories/IVariantsRepository.js";

interface Request {
  variant_id: string;
  stock: number;
}

export class UpdateStockService {
  constructor(private variantsRepository: IVariantsRepository) {}

  async execute({ variant_id, stock }: Request): Promise<void> {
    if (stock < 0) {
      throw new AppError("O estoque não pode ser um valor negativo.");
    }

    await this.variantsRepository.updateStock(variant_id, stock);
  }
}
