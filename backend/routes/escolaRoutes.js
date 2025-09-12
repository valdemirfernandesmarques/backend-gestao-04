const express = require('express');
const router = express.Router();
const escolaController = require('../controllers/escolaController');
const auth = require('../middleware/authMiddleware');

// Criar escola
router.post('/', auth, escolaController.criar);

// Listar escolas
router.get('/', auth, escolaController.listar);

// Obter escola por ID
router.get('/:id', auth, escolaController.obter);

// Atualizar escola
router.put('/:id', auth, escolaController.atualizar);

// Remover escola
router.delete('/:id', auth, escolaController.remover);

module.exports = router;
