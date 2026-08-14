import { pool } from "../../../config/db.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { IPaymentsRepository } from "../repositories/IPaymentsRepository.js";

interface WebhookPayload {
  transaction_id: string;
  event: "PAYMENT_RECEIVED" | "PAYMENT_FAILED";
}

export class HandleWebhookService {
  constructor(private paymentsRepository: IPaymentsRepository) {}

  async execute({ transaction_id, event }: WebhookPayload): Promise<void> {
    const payment =
      await this.paymentsRepository.findByTransactionId(transaction_id);

    if (!payment) {
      throw new AppError("Transação não encontrada.", 404);
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (event === "PAYMENT_RECEIVED") {
        // 1. Atualiza status no pagamento
        await connection.query("UPDATE payments SET status = ? WHERE id = ?", [
          "PAID",
          payment.id,
        ]);

        // 2. Atualiza status no pedido
        await connection.query("UPDATE orders SET status = ? WHERE id = ?", [
          "PAID",
          payment.order_id,
        ]);
      } else if (event === "PAYMENT_FAILED") {
        await connection.query("UPDATE payments SET status = ? WHERE id = ?", [
          "FAILED",
          payment.id,
        ]);
        await connection.query("UPDATE orders SET status = ? WHERE id = ?", [
          "CANCELED",
          payment.order_id,
        ]);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
