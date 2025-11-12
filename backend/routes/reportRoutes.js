// backend/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Get de Relatórios
router.get("/reports/dashboard-summary", async (_req, res) => {
  try {
// conta o total de usuários
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");
    
// Conta o total de matriculas
    const studentsResult = await pool.query("SELECT COUNT(*) FROM pre_matriculas");
    
// Conta as matriculas por status 
    const statusResult = await pool.query(
      "SELECT status, COUNT(*) as count FROM pre_matriculas GROUP BY status"
    );

    res.json({
      total_users: parseInt(usersResult.rows[0].count, 10) || 0,
      total_students: parseInt(studentsResult.rows[0].count, 10) || 0,
      students_by_status: statusResult.rows,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;