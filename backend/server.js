// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// --- Middlewares Globais ---
app.use(express.json()); // Essencial para ler o req.body em JSON
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// --- Rotas ---
// Diz ao Express para usar os arquivos de rotas que criamos
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/reportRoutes'));
app.use('/api', require('./routes/preMatriculaRoutes'));

// --- Inicialização do Servidor ---
const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`[API] Listening on ${PORT}`);
});