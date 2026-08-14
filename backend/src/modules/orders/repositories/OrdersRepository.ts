import { randomUUID } from "crypto";
import { pool } from "../../../config/db.js";
import {
  IOrdersRepository,
  Order,
  CreateOrderDTO,
} from "./IOrdersRepository.js";

export class OrdersRepository implements IOrdersRepository {
  async create(data: CreateOrderDTO): Promise<Order> {
    const connection = await pool.getConnection();

    try {
      // Inicia Transação SQL (Se algo der errado, nada é gravado no banco)
      await connection.beginTransaction();

      const orderId = randomUUID();
      const { user_id, total_amount, items } = data;

      // 1. Grava o Pedido Principal
      await connection.query(
        "INSERT INTO orders (id, user_id, total_amount, status) VALUES (?, ?, ?, ?)",
        [orderId, user_id, total_amount, "PENDING"],
      );

      // 2. Grava cada item do Pedido e dá baixa no estoque
      for (const item of items) {
        const itemId = randomUUID();
        await connection.query(
          "INSERT INTO order_items (id, order_id, variant_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)",
          [itemId, orderId, item.variant_id, item.quantity, item.unit_price],
        );

        // Baixa de Estoque
        await connection.query(
          "UPDATE product_variants SET stock = stock - ? WHERE id = ?",
          [item.quantity, item.variant_id],
        );
      }

      await connection.commit();

      return {
        id: orderId,
        user_id,
        total_amount,
        status: "PENDING",
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(id: string, user_id: string): Promise<Order | null> {
    const [orders]: any = await pool.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [id, user_id],
    );

    if (orders.length === 0) return null;

    const [items]: any = await pool.query(
      `SELECT oi.*, p.name as product_name
       FROM order_items oi
       INNER JOIN product_variants pv ON oi.variant_id = pv.id
       INNER JOIN products p ON pv.product_id = p.id
       WHERE oi.order_id = ?`,
      [id],
    );

    return {
      ...orders[0],
      items,
    };
  }

  async findByUser(user_id: string): Promise<Order[]> {
    const [rows]: any = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [user_id],
    );
    return rows;
  }
}
