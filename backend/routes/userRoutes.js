const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Criar usuário (somente autenticado)
router.post('/', auth, userController.criar);

// Listar todos os usuários
router.get('/', auth, userController.listar);

// Obter usuário por ID
router.get('/:id', auth, userController.obter);

// Atualizar usuário por ID
router.put('/:id', auth, userController.atualizar);

// Remover usuário por ID
router.delete('/:id', auth, userController.remover);

module.exports = router;
