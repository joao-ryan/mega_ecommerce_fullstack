import { Router } from "express";
import { CartController } from "./controllers/CartController.js";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated.js";

const cartRouter = Router();
const cartController = new CartController();

// Todas as rotas do carrinho exigem que o usuário esteja logado (JWT)
cartRouter.use(ensureAuthenticated);

cartRouter.get("/", cartController.index);
cartRouter.post("/", cartController.add);
cartRouter.delete("/:id", cartController.delete);

export default cartRouter;
