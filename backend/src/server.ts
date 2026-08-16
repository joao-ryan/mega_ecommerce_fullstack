import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { testConnection } from "./config/db.js";
import { initTables } from "./config/initDb.js";

const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta: http://localhost:${PORT}`);
  try {
    await testConnection();
    await initTables();
  } catch (dbError) {
    console.error(
      "⚠️ Falha de conexão inicial com o Banco de Dados MySQL:",
      dbError,
    );
  }
});
