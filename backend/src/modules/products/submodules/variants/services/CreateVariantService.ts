import { AppError } from "../../../../../shared/errors/AppError.js";
import {
  IVariantsRepository,
  CreateVariantDTO,
  ProductVariant,
} from "../repositories/IVariantsRepository.js";

export class CreateVariantService {
  constructor(private variantsRepository: IVariantsRepository) {}

  async execute(data: CreateVariantDTO): Promise<ProductVariant> {
    if (!data.product_id || !data.sku || data.price === undefined) {
      throw new AppError("Produto ID, SKU e Preço são obrigatórios.");
    }

    const skuExists = await this.variantsRepository.findBySku(data.sku);

    if (skuExists) {
      throw new AppError("Já existe uma variante cadastrada com este SKU.");
    }

    return await this.variantsRepository.create(data);
  }
}
