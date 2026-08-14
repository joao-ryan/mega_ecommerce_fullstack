import { Request, Response } from "express";
import { PaymentsRepository } from "../repositories/PaymentsRepository.js";
import { ProcessPaymentService } from "../services/ProcessPaymentService.js";
import { HandleWebhookService } from "../services/HandleWebhookService.js";

export class PaymentsController {
  async process(req: Request, res: Response): Promise<Response> {
    const { order_id, payment_method } = req.body;

    const paymentsRepository = new PaymentsRepository();
    const processPaymentService = new ProcessPaymentService(paymentsRepository);

    const result = await processPaymentService.execute({
      order_id,
      payment_method,
    });

    return res.status(201).json(result);
  }

  // Rota pública para receber os avisos automáticos do Gateway (Webhook)
  async webhook(req: Request, res: Response): Promise<Response> {
    const { transaction_id, event } = req.body;

    const paymentsRepository = new PaymentsRepository();
    const handleWebhookService = new HandleWebhookService(paymentsRepository);

    await handleWebhookService.execute({ transaction_id, event });

    return res.json({ message: "Webhook processado com sucesso!" });
  }
}
