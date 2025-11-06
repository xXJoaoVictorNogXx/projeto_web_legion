// backend/db.js
const { Pool } = require("pg");

// Função para validar variáveis de ambiente
function required(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`[ENV] Missing ${name}`);
    process.exit(1);
  }
  return v;
}

const pool = new Pool({
  host: required("DB_HOST"),
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: required("DB_USER"),
  password: required("DB_PASSWORD"),
  database: required("DB_NAME")
});

module.exports = { pool };