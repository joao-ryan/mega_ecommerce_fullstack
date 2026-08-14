import {
  IProductsRepository,
  CreateProductDTO,
} from "../repositories/IProductsRepository.js";

export class CreateProductService {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(data: CreateProductDTO) {
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, "-");

    const productAlreadyExists = await this.productsRepository.findBySlug(slug);

    if (productAlreadyExists) {
      throw new Error("Produto com este slug já cadastrado.");
    }

    const product = await this.productsRepository.create({
      ...data,
      slug,
    });

    return product;
  }
}
