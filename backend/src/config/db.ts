import mysql from "mysql2/promise";

// Se existir DATABASE_URL (Render/Aiven), usa a URI diretamente
export const pool = process.env.DATABASE_URL
  ? mysql.createPool({
      uri: process.env.DATABASE_URL,
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
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
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
