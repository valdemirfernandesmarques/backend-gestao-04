// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ================================
// Rotas de autenticação
// ================================

// Login do usuário
// URL final: POST http://localhost:3000/api/auth/login
router.post('/login', authController.login);

module.exports = router;
