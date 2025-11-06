// backend/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Rota de Resumo (MODIFICADA)
// Agora retorna um resumo de ALUNOS (pré-matrículas)
router.get("/reports/summary", async (_req, res) => {
  try {
    // Vamos assumir que sua tabela de formulário se chama 'pre_matriculas'
    const totalResult = await pool.query("SELECT COUNT(*) AS total_matriculas FROM pre_matriculas");
    const totalMatriculas = totalResult.rows[0].total_matriculas;

    // Vamos assumir que a tabela 'pre_matriculas' tem uma coluna 'status'
    // (Ex: 'PENDENTE', 'APROVADO')
    const byStatusResult = await pool.query(
      "SELECT status, COUNT(*) as count FROM pre_matriculas GROUP BY status"
    );
    const matriculasByStatus = byStatusResult.rows;

    res.json({
      total_matriculas: parseInt(totalMatriculas, 10),
      matriculas_por_status: matriculasByStatus,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Rota de Exportação CSV (MODIFICADA)
// A URL continua /reports/users-csv para não quebrar seu frontend,
// mas a lógica agora busca dados dos ALUNOS (pre_matriculas).
router.get("/reports/users-csv", async (_req, res) => {
    try {
        // Seleciona os campos mais importantes da pré-matrícula para o CSV
        const { rows } = await pool.query(
            `SELECT 
               id, status, child_name, birth_date, gender, race, 
               guardian_name, guardian_cpf, guardian_phone, 
               address_street, address_neighborhood, address_city
             FROM pre_matriculas ORDER BY child_name`
        );
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;