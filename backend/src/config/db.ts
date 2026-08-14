import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Pool de conexões reaproveitável
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "mega_ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// Função rápida para testar a conexão na inicialização
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexão com o banco de dados MySQL realizada com sucesso!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error);
  }
}
