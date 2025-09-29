// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// ================================
// Controller de Autenticação
// ================================

// Login do usuário
exports.login = async (req, res) => {
  // 🔹 Debug: mostrar o que chega no corpo da requisição
  console.log("REQ.BODY:", req.body);

  try {
    const { email, password } = req.body; // ✅ NOVO: 'senha' foi trocado por 'password'

    // Verifica se os campos foram enviados
    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    // Procura usuário no banco
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    // Valida senha com bcrypt
    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    // Gera token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        perfil: user.perfil,
        escolaId: user.escolaId
      },
      process.env.JWT_SECRET || "segredo123", // ⚠️ Certifique-se de ter JWT_SECRET no .env
      { expiresIn: "8h" }
    );

    // Retorna resposta com token
    res.json({
      message: "Login realizado com sucesso",
      token
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
