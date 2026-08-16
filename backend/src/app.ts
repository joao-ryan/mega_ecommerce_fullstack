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

// Configuração Permissiva e Segura de CORS
app.use(
  cors({
    origin: "*", // Permite chamadas do React na Vercel/Netlify/Localhost
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  }),
);

// Expansão do limite de payload para suportar imagens e arrays de checkout
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
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

// Middleware Global de Tratamento de Erros (Evita crash do processo Node)
app.use(errorHandler);

export { app };

