import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false, // Obrigatório para conexões SSL com Aiven no Render
  },
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
