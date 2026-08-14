import { randomUUID } from "crypto";
import { pool } from "../../../config/db.js";
import {
  IPaymentsRepository,
  Payment,
  CreatePaymentDTO,
} from "./IPaymentsRepository.js";

export class PaymentsRepository implements IPaymentsRepository {
  async create(data: CreatePaymentDTO): Promise<Payment> {
    const id = randomUUID();
    const { order_id, payment_method, transaction_id } = data;

    await pool.query(
      `INSERT INTO payments (id, order_id, payment_method, status, transaction_id)
       VALUES (?, ?, ?, ?, ?)`,
      [id, order_id, payment_method, "PENDING", transaction_id || null],
    );

    return { id, order_id, payment_method, status: "PENDING", transaction_id };
  }

  async findByOrderId(order_id: string): Promise<Payment | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM payments WHERE order_id = ?",
      [order_id],
    );
    return rows[0] || null;
  }

  async findByTransactionId(transaction_id: string): Promise<Payment | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM payments WHERE transaction_id = ?",
      [transaction_id],
    );
    return rows[0] || null;
  }

  async updateStatus(
    id: string,
    status: "PENDING" | "PAID" | "FAILED",
  ): Promise<void> {
    await pool.query("UPDATE payments SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  }
}
