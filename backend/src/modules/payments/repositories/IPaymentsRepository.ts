export interface Payment {
  id: string;
  order_id: string;
  payment_method: "PIX" | "CREDIT_CARD";
  status: "PENDING" | "PAID" | "FAILED";
  transaction_id?: string;
  created_at?: Date;
}

export interface CreatePaymentDTO {
  order_id: string;
  payment_method: "PIX" | "CREDIT_CARD";
  transaction_id?: string;
}

export interface IPaymentsRepository {
  create(data: CreatePaymentDTO): Promise<Payment>;
  findByOrderId(order_id: string): Promise<Payment | null>;
  findByTransactionId(transaction_id: string): Promise<Payment | null>;
  updateStatus(
    id: string,
    status: "PENDING" | "PAID" | "FAILED",
  ): Promise<void>;
}
