require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// valida ENV simples
function required(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`[ENV] Missing ${name}`);
    process.exit(1);
  }
  return v;
}

const PORT = parseInt(process.env.PORT || "3000", 10);
const pool = new Pool({
  host: required("DB_HOST"),
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: required("DB_USER"),
  password: required("DB_PASSWORD"),
  database: required("DB_NAME")
});

// health
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "up" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

// lista todos
app.get("/api/users", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// busca por id
app.get("/api/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// cria
app.post("/api/users", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  if (name.length < 2) return res.status(400).json({ error: "name inválido" });
  if (!email.includes("@")) return res.status(400).json({ error: "email inválido" });
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",
      [name, email]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// atualiza
app.put("/api/users/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  if (name.length < 2) return res.status(400).json({ error: "name inválido" });
  if (!email.includes("@")) return res.status(400).json({ error: "email inválido" });

  try {
    const { rows } = await pool.query(
      "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email",
      [name, email, id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// delete
app.delete("/api/users/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM users WHERE id=$1",
      [id]
    );
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`[API] Listening on ${PORT}`);
});
