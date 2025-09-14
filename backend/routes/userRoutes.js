// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Criar usuário (POST)
router.post('/', auth, userController.criar);

// Listar usuários (GET)
router.get('/', auth, userController.listar);

// Obter usuário por ID (GET)
router.get('/:id', auth, userController.obter);

// Atualizar usuário (PUT)
router.put('/:id', auth, userController.atualizar);

// Remover usuário (DELETE)
router.delete('/:id', auth, userController.remover);

module.exports = router;