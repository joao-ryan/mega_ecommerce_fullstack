import { AppError } from "../../../../../shared/errors/AppError.js";
import {
  IProductImagesRepository,
  ProductImage,
} from "../repositories/IProductImagesRepository.js";

interface Request {
  product_id: string;
  filename: string;
}

export class UploadProductImageService {
  constructor(private productImagesRepository: IProductImagesRepository) {}

  async execute({ product_id, filename }: Request): Promise<ProductImage> {
    if (!product_id || !filename) {
      throw new AppError("ID do produto e arquivo de imagem são obrigatórios.");
    }

    const image_url = `/uploads/${filename}`;

    return await this.productImagesRepository.create(product_id, image_url);
  }
}
