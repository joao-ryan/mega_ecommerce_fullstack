import { pool } from "../../../config/db.js";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at?: Date;
}

export class ProductsRepository {
  async findAll(): Promise<Product[]> {
    const [rows]: any = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC",
    );
    return rows;
  }

  async findById(id: string): Promise<Product | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }
}
