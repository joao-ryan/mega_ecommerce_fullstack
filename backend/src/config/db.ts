import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Garante a leitura imediata das variáveis de ambiente no Render
dotenv.config();

const connectionUri = process.env.DATABASE_URL;

// Debug para validar no log do Render se a URI está sendo detectada
if (connectionUri) {
  console.log("🔗 DATABASE_URL detectada! Conectando ao banco remoto...");
} else {
  console.warn(
    "⚠️ DATABASE_URL não encontrada! Usando configurações locais...",
  );
}

export const pool = connectionUri
  ? mysql.createPool({
      uri: connectionUri,
      ssl: {
        rejectUnauthorized: false,
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  : mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "ecommerce",
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexão com o banco de dados realizada com sucesso!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error);
  }
}
