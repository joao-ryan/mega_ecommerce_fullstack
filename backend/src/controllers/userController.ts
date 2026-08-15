import { Request, Response } from "express";
import { pool } from "../config/db.js";

export async function syncClerkUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const { clerkId, email, name } = req.body;

  if (!clerkId || !email) {
    return res.status(400).json({ error: "clerkId e email são obrigatórios." });
  }

  try {
    const query = `
      INSERT INTO users (clerk_id, email, name)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);
    `;

    await pool.execute(query, [clerkId, email, name || ""]);

    return res.status(200).json({
      message: "Usuário sincronizado no MySQL com sucesso!",
      user: { clerkId, email, name },
    });
  } catch (error) {
    console.error("❌ Erro ao sincronizar usuário do Clerk:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao salvar usuário no MySQL." });
  }
}
