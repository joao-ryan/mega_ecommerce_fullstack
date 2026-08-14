import { Router } from "express";
import { VariantsController } from "./controllers/VariantsController.js";
import { ensureAuthenticated } from "../../../../shared/middlewares/ensureAuthenticated.js";

const variantsRouter = Router();
const variantsController = new VariantsController();

// Criação e atualização reservadas para usuários autenticados (ou admins)
variantsRouter.post("/", ensureAuthenticated, variantsController.create);
variantsRouter.patch(
  "/:id/stock",
  ensureAuthenticated,
  variantsController.updateStock,
);

export default variantsRouter;
