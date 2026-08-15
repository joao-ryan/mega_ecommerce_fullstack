import { Request, Response } from "express";
import { pool } from "../config/db.js";

export async function getProducts(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
    return res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
    return res.status(500).json({ error: "Erro interno ao buscar produtos." });
  }
}

export async function createProduct(
  req: Request,
  res: Response,
): Promise<Response> {
  const { name, description, price, stock, image_url, category } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "Nome e preço são obrigatórios." });
  }

  try {
    const query = `
      INSERT INTO products (name, description, price, stock, image_url, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result]: any = await pool.execute(query, [
      name,
      description || "",
      price,
      stock || 0,
      image_url || "",
      category || "Geral",
    ]);

    return res.status(201).json({
      message: "Produto cadastrado com sucesso!",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Erro ao cadastrar produto:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao cadastrar produto." });
  }
}
