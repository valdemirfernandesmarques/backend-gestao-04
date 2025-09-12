const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Procura o usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Compara a senha fornecida com a senha hash do banco
    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Flag para verificar isenção de taxa (caso queira usar em pagamentos)
    const isIsentoTaxa = user.email === 'admin@escolateste.com';

    // Gera o token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        perfil: user.perfil,
        escolaId: user.escolaId,
        isIsentoTaxa,
      },
      process.env.JWT_SECRET || 'segredo123',
      { expiresIn: '7d' }
    );

    // Retorna dados do usuário e token
    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        perfil: user.perfil,
        escolaId: user.escolaId,
        nome: user.nome,
        isIsentoTaxa,
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno no login' });
  }
};
