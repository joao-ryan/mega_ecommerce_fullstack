import { pool } from "./db.js";

export async function initTables() {
  try {
    // 1. Tabela de Usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NULL,
        role VARCHAR(50) DEFAULT 'CLIENT',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabela de Categorias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    // 3. Tabela de Produtos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        category_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Variantes de Produtos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id VARCHAR(255) PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        sku VARCHAR(100) NULL,
        price DECIMAL(10, 2) NOT NULL,
        promo_price DECIMAL(10, 2),
        stock INT NOT NULL DEFAULT 0,
        attributes JSON
      );
    `);

    // 5. Imagens dos Produtos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id VARCHAR(255) PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Tabela de Carrinho (Suporta visitantes e Clerk)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        variant_id VARCHAR(255) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 7. Tabela de Pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Itens do Pedido
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(255) PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        variant_id VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL
      );
    `);

    // 9. Pagamentos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(255) PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        transaction_id VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // DDL de Migração Automática para o Aiven (Garante conversão caso a tabela já exista)
    try {
      await pool.query(
        `ALTER TABLE cart_items MODIFY COLUMN user_id VARCHAR(255) NOT NULL;`,
      );
      await pool.query(
        `ALTER TABLE cart_items MODIFY COLUMN variant_id VARCHAR(255) NOT NULL;`,
      );
      await pool.query(
        `ALTER TABLE orders MODIFY COLUMN user_id VARCHAR(255) NOT NULL;`,
      );
    } catch (_) {
      // Ignora erro caso as colunas já estejam no formato correto
    }

    console.log(
      "⚡ Tabelas do MySQL verificadas, atualizadas e prontas para uso!",
    );
  } catch (error) {
    console.error("❌ Erro ao criar/atualizar tabelas:", error);
  }
}
