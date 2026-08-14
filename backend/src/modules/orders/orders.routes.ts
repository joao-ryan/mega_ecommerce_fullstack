import { Router } from "express";
import { OrdersController } from "./controllers/OrdersController.js";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated.js";

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.use(ensureAuthenticated);

ordersRouter.post("/", ordersController.create);
ordersRouter.get("/", ordersController.index);
ordersRouter.get("/:id", ordersController.show);

export default ordersRouter;
