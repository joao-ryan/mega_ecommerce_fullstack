import { randomUUID } from "crypto";
import { pool } from "../../../config/db.js";
import { ICartRepository, CartItem, AddToCartDTO } from "./ICartRepository.js";

export class CartRepository implements ICartRepository {
  async findByUserAndVariant(
    user_id: string,
    variant_id: string,
  ): Promise<CartItem | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = ? AND variant_id = ?",
      [user_id, variant_id],
    );
    return rows[0] || null;
  }

  async addItem(data: AddToCartDTO): Promise<CartItem> {
    const id = randomUUID();
    const { user_id, variant_id, quantity } = data;

    await pool.query(
      "INSERT INTO cart_items (id, user_id, variant_id, quantity) VALUES (?, ?, ?, ?)",
      [id, user_id, variant_id, quantity],
    );

    return { id, user_id, variant_id, quantity };
  }

  async updateQuantity(id: string, quantity: number): Promise<void> {
    await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [
      quantity,
      id,
    ]);
  }

  async getUserCart(user_id: string): Promise<CartItem[]> {
    // Faz um JOIN completo para retornar as fotos, preços e dados do produto junto com o carrinho
    const [rows]: any = await pool.query(
      `SELECT
        ci.id,
        ci.user_id,
        ci.variant_id,
        ci.quantity,
        p.name as product_name,
        pv.sku,
        pv.price,
        pv.promo_price,
        pv.attributes
       FROM cart_items ci
       INNER JOIN product_variants pv ON ci.variant_id = pv.id
       INNER JOIN products p ON pv.product_id = p.id
       WHERE ci.user_id = ?`,
      [user_id],
    );

    return rows;
  }

  async removeItem(id: string, user_id: string): Promise<void> {
    await pool.query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [
      id,
      user_id,
    ]);
  }

  async clearCart(user_id: string): Promise<void> {
    await pool.query("DELETE FROM cart_items WHERE user_id = ?", [user_id]);
  }
}
