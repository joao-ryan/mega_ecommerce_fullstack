import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connectionUri = process.env.DATABASE_URL;

console.log(
  "Status da URI:",
  connectionUri ? "DATABASE_URL Encontrada" : "DATABASE_URL Ausente",
);

// Passa a URI diretamente como parâmetro principal do Pool
export const pool = connectionUri
  ? mysql.createPool(connectionUri)
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
    console.log("✅ Conexão com o banco do Aiven realizada com sucesso!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error);
  }
}
