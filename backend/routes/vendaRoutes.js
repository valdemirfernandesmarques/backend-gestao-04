// backend/routes/vendaRoutes.js
const express = require('express');
const router = express.Router();
const vendaController = require('../controllers/vendaController');
const auth = require('../middleware/authMiddleware'); // <-- corrigido aqui

router.post('/', auth, vendaController.criarVenda);
router.get('/', auth, vendaController.listarVendas);
router.get('/:id', auth, vendaController.obterVenda);

module.exports = router;
