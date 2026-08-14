import { pool } from "../../../config/db.js";
import {
  IProductsRepository,
  CreateProductDTO,
  Product,
} from "./IProductsRepository.js";

export class ProductsRepository implements IProductsRepository {
  async create(data: CreateProductDTO): Promise<Product> {
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, "-");
    const [result]: any = await pool.query(
      "INSERT INTO products (name, slug, description, price, stock) VALUES (?, ?, ?, ?, ?)",
      [data.name, slug, data.description, data.price, data.stock || 0],
    );

    return {
      id: result.insertId,
      ...data,
      slug,
    };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM products WHERE slug = ?",
      [slug],
    );
    return rows[0] || null;
  }

  async findAll(): Promise<Product[]> {
    const [rows]: any = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC",
    );
    return rows as Product[];
  }

  async findById(id: string): Promise<Product | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }
}
