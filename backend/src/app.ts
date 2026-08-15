import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import productsRouter from "./modules/products/products.routes.js";
import variantsRouter from "./modules/products/submodules/variants/variants.routes.js";
import imagesRouter from "./modules/products/submodules/images/images.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import ordersRouter from "./modules/orders/orders.routes.js";
import paymentsRouter from "./modules/payments/payments.routes.js";

import { errorHandler } from "./shared/middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // porta padrão do Vite
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Uploads
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRouter);
app.use("/api/variants", variantsRouter);
app.use("/api/products/images", imagesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API E-Commerce Ativa!" });
});

// Middleware Global de Tratamento de Erros
app.use(errorHandler);

export { app };
