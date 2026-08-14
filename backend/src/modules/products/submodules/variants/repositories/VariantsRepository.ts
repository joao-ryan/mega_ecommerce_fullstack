import { randomUUID } from "crypto";
import { pool } from "../../../../../config/db.js";
import {
  IVariantsRepository,
  ProductVariant,
  CreateVariantDTO,
} from "./IVariantsRepository.js";

export class VariantsRepository implements IVariantsRepository {
  async create(data: CreateVariantDTO): Promise<ProductVariant> {
    const id = randomUUID();
    const { product_id, sku, price, promo_price, stock, attributes } = data;

    await pool.query(
      `INSERT INTO product_variants (id, product_id, sku, price, promo_price, stock, attributes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        product_id,
        sku,
        price,
        promo_price || null,
        stock,
        attributes ? JSON.stringify(attributes) : null,
      ],
    );

    return {
      id,
      product_id,
      sku,
      price,
      promo_price,
      stock,
      attributes,
    };
  }

  async findBySku(sku: string): Promise<ProductVariant | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM product_variants WHERE sku = ?",
      [sku],
    );
    return rows[0] || null;
  }

  async findByProductId(product_id: string): Promise<ProductVariant[]> {
    const [rows]: any = await pool.query(
      "SELECT * FROM product_variants WHERE product_id = ?",
      [product_id],
    );
    return rows;
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    await pool.query("UPDATE product_variants SET stock = ? WHERE id = ?", [
      newStock,
      id,
    ]);
  }
}
