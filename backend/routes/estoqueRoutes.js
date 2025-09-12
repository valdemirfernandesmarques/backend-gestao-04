const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');
const auth = require('../middleware/authMiddleware'); // corrigido

router.get('/produtos', auth, estoqueController.listarProdutos);
router.patch('/produto/:id', auth, estoqueController.atualizarProduto);

module.exports = router;
