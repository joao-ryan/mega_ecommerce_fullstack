import { randomUUID } from "crypto";
import { pool } from "../../../../../config/db.js";
import {
  IProductImagesRepository,
  ProductImage,
} from "./IProductImagesRepository.js";

export class ProductImagesRepository implements IProductImagesRepository {
  async create(product_id: string, image_url: string): Promise<ProductImage> {
    const id = randomUUID();

    await pool.query(
      "INSERT INTO product_images (id, product_id, image_url) VALUES (?, ?, ?)",
      [id, product_id, image_url],
    );

    return { id, product_id, image_url };
  }

  async findByProductId(product_id: string): Promise<ProductImage[]> {
    const [rows]: any = await pool.query(
      "SELECT * FROM product_images WHERE product_id = ?",
      [product_id],
    );
    return rows;
  }
}
