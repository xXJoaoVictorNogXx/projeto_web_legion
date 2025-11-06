// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { pool } = require("../db"); // Importa o pool
const bcrypt = require("bcrypt");

// Health check (movido para cá, mas poderia ter um arquivo próprio)
router.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "up" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

// --- CRUD DE USUÁRIOS (ADMIN) ---

// (CORRIGIDO) Cria usuário (Admin)
router.post("/users", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Todos os campos (name, email, password, role) são obrigatórios." });
  }
  if (password.length < 6) return res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });

  try {
    // CORREÇÃO: Adicionada verificação de email existente
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ error: "Este email já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role] // CORREÇÃO: Inserindo o 'role'
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Lista todos
router.get("/users", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id" // Adicionei 'role'
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Busca por id
router.get("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { rows } = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1", // Adicionei 'role'
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Atualiza
router.put("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, email, role } = req.body; // Admin pode atualizar o 'role'

  // Validações
  if (!name || !email || !role) return res.status(400).json({ error: "Nome, email e role são obrigatórios" });

  try {
    const { rows } = await pool.query(
      "UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4 RETURNING id, name, email, role",
      [name, email, role, id] // Atualiza o 'role'
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete
router.delete("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rowCount } = await pool.query("DELETE FROM users WHERE id=$1", [id]);
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// --- ROTAS PÚBLICAS (AUTENTICAÇÃO) ---

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email e senha são obrigatórios." });

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1", // Pega tudo, inclusive a senha
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Credenciais inválidas" });

    const { password: _, ...userWithoutPassword } = user; // Remove a senha da resposta
    res.json({ message: "Login bem-sucedido!", user: userWithoutPassword });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Cadastro público
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
  if (password.length < 6) return res.status(400).json({ error: "A senha deve ter no mínimo 6 caracteres." });
  if (!email.includes("@")) return res.status(400).json({ error: "Formato de email inválido." });

  try {
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ error: "Este email já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = 'PROFESSOR'; // Define um cargo padrão
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, defaultRole]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;