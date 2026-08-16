import { pool } from "./src/config/db.js";

async function checkProducts() {
  const [rows] = await pool.query("SELECT * FROM products;");
  console.log("📦 Produtos no Aiven:", rows);
}

checkProducts();
