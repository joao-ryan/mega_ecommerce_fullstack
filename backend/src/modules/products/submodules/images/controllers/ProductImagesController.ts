import { Request, Response } from "express";
import { ProductImagesRepository } from "../repositories/ProductImagesRepository.js";
import { UploadProductImageService } from "../services/UploadProductImageService.js";

export class ProductImagesController {
  async create(req: Request, res: Response): Promise<Response> {
    const { product_id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    const imagesRepository = new ProductImagesRepository();
    const uploadImageService = new UploadProductImageService(imagesRepository);

    const image = await uploadImageService.execute({
      product_id,
      filename: file.filename,
    });

    return res.status(201).json(image);
  }
}
