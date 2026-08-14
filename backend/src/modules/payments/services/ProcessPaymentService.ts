import { AppError } from "../../../shared/errors/AppError.js";
import {
  IPaymentsRepository,
  Payment,
} from "../repositories/IPaymentsRepository.js";

interface Request {
  order_id: string;
  payment_method: "PIX" | "CREDIT_CARD";
}

interface PaymentResponse {
  payment: Payment;
  pix_qr_code?: string;
  pix_copy_paste?: string;
}

export class ProcessPaymentService {
  constructor(private paymentsRepository: IPaymentsRepository) {}

  async execute({
    order_id,
    payment_method,
  }: Request): Promise<PaymentResponse> {
    const existingPayment =
      await this.paymentsRepository.findByOrderId(order_id);

    if (existingPayment) {
      throw new AppError("Já existe uma cobrança iniciada para este pedido.");
    }

    // Simula a geração do código Pix único (Em produção, aqui entraria o SDK da Asaas / Mercado Pago / Stripe)
    const fakeTransactionId = `tx_${Date.now()}`;
    const payment = await this.paymentsRepository.create({
      order_id,
      payment_method,
      transaction_id: fakeTransactionId,
    });

    if (payment_method === "PIX") {
      return {
        payment,
        pix_qr_code:
          "https://api.qrserver.com/v1/create-qr-code/?data=PIX_DEMO",
        pix_copy_paste: `00020126360014BR.GOV.BCB.PIX0114+558599999999520400005303986540510.005802BR5910E-COMMERCE6009FORTALEZA62070503***6304E2CA`,
      };
    }

    return { payment };
  }
}
