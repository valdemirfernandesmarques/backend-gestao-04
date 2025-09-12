// backend/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const protectedController = require('../controllers/protectedController');

// Qualquer rota aqui exige token
router.get('/ping', auth, protectedController.ping);

module.exports = router;
