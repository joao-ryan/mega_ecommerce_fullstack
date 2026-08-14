import mysql from "mysql2/promise";

// Lê a URI de conexão (Aiven no Render) ou utiliza variáveis separadas
const connectionUri = process.env.DATABASE_URL;

export const pool = connectionUri
  ? mysql.createPool({
      uri: connectionUri,
      ssl: {
        rejectUnauthorized: false, // Obrigatório para o Aiven
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

// Exporta explicitamente a função testConnection
export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexão com o banco de dados realizada com sucesso!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error);
  }
}
