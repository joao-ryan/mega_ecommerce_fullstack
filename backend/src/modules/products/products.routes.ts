import { Router } from "express";
import { ProductsController } from "./controllers/ProductsController.js";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated.js";

const productsRouter = Router();
const productsController = new ProductsController();

// Rotas públicas
productsRouter.get("/", productsController.index);

// Rotas protegidas
productsRouter.post("/", ensureAuthenticated, productsController.create);

export default productsRouter;
