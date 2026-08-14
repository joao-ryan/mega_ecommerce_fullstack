import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; // 1. Importa o Morgan

import { testConnection } from "./config/db.js";
import { initTables } from "./config/initDb.js";

import authRoutes from "./routes/authRoute.js";
import productsRouter from "./modules/products/products.routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";

import variantsRouter from "./modules/products/submodules/variants/variants.routes.js";
import imagesRouter from "./modules/products/submodules/images/images.routes.js";

import cartRouter from "./modules/cart/cart.routes.js";

import ordersRouter from "./modules/orders/orders.routes.js";

import paymentsRouter from "./modules/payments/payments.routes.js";

// ...

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 2. Ativa o log no terminal (o modo 'dev' mostra o método com cores no terminal)
app.use(morgan("dev"));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API rodando em Arquitetura Sênior!" });
});

// Servir arquivos estáticos de upload

// Rotas do Módulo
app.use('/api/variants', variantsRouter);
app.use('/api/products/images', imagesRouter);

app.use("/api/cart", cartRouter);

app.use("/api/orders", ordersRouter);

app.use("/api/payments", paymentsRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
  await testConnection();
  await initTables();
});
