import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../app.js";

describe("Suite de Testes E2E - API E-Commerce", () => {
  let token: string;

  const testUser = {
    name: "Desenvolvedor Teste",
    email: `teste_${Date.now()}@exemplo.com`,
    password: "password123",
  };

  it("1. Deve registrar um novo usuário", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect([200, 201]).toContain(res.status);
  });

  it("2. Deve autenticar e retornar o token JWT", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("3. Deve listar produtos", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("4. Deve buscar o carrinho do usuário autenticado", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
