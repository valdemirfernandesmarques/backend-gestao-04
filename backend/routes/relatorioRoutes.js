// backend/routes/relatorioRoutes.js
const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const auth = require('../middleware/authMiddleware'); // <- sem "s"

// Relatórios financeiros
router.get('/financeiro/escola', auth, relatorioController.relatorioFinanceiroEscola);
router.get('/financeiro/geral', auth, relatorioController.relatorioFinanceiroGeral);

module.exports = router;
