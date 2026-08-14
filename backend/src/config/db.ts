import mysql from "mysql2/promise";

// Lê explicitamente a DATABASE_URL do ambiente no Render
const connectionString = process.env.DATABASE_URL;

export const pool = connectionString
  ? mysql.createPool({
      uri: connectionString,
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
