import { Router } from "express";
import { PaymentsController } from "./controllers/PaymentsController.js";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated.js";

const paymentsRouter = Router();
const paymentsController = new PaymentsController();

// Checkout de pagamento exige login
paymentsRouter.post(
  "/checkout",
  ensureAuthenticated,
  paymentsController.process,
);

// Webhook do Gateway é público (pois é chamado pelos servidores do gateway)
paymentsRouter.post("/webhook", paymentsController.webhook);

export default paymentsRouter;
