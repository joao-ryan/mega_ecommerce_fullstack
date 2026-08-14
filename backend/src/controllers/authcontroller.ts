import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { pool } from "../config/db.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios." });
    }

    // 1. Verifica se o e-mail já existe
    const [existingUser]: any = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Este e-mail já está cadastrado." });
    }

    // 2. Gera o hash da senha e o UUID
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    // 3. Insere o novo usuário (por padrão como CLIENT)
    await pool.query(
      "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [userId, name, email, passwordHash, "CLIENT"],
    );

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: { id: userId, name, email, role: "CLIENT" },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "E-mail e senha são obrigatórios." });
    }

    // 1. Busca o usuário pelo e-mail
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const user = rows[0];

    // 2. Compara a senha informada com o hash salvo no banco
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // 3. Gera o Token JWT
    const secret = process.env.JWT_SECRET || "secret";
    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "1d",
    });

    return res.json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};
