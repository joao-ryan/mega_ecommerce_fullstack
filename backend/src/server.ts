import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { testConnection } from "./config/db.js";
import { initTables } from "./config/initDb.js";

import userRoutes from "./routes/userRoutes.js"; // Sincronização do Clerk
import productsRouter from "./modules/products/products.routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";

import variantsRouter from "./modules/products/submodules/variants/variants.routes.js";
import imagesRouter from "./modules/products/submodules/images/images.routes.js";

import cartRouter from "./modules/cart/cart.routes.js";
import ordersRouter from "./modules/orders/orders.routes.js";
import paymentsRouter from "./modules/payments/payments.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rota para Sincronização do Clerk (Substitui ou complementa o auth anterior)
app.use("/api/users", userRoutes);

// Rotas do Módulo
app.use("/api/products", productsRouter);
app.use("/api/variants", variantsRouter);
app.use("/api/products/images", imagesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API E-commerce rodando em Arquitetura Sênior!",
  });
});

// Middleware Global de Tratamento de Erros
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
  await testConnection();
  await initTables();
});
