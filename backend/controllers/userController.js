// backend/controllers/userController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Campos válidos de perfil
const perfisValidos = ['SUPER_ADMIN', 'ADMIN_ESCOLA', 'USUARIO'];

// Criar usuário
exports.criar = async (req, res) => {
  try {
    const { nome, email, senha, perfil, escolaId } = req.body;

    // Valida campos obrigatórios
    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha e perfil' });
    }

    // Valida perfil
    if (!perfisValidos.includes(perfil)) {
      return res.status(400).json({ error: `Perfil inválido. Perfis válidos: ${perfisValidos.join(', ')}` });
    }

    // ADMIN_ESCOLA só pode criar usuários dentro da própria escola
    if (req.user.perfil === 'ADMIN_ESCOLA' && escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado: não pode criar usuário em outra escola' });
    }

    // SUPER_ADMIN pode criar em qualquer escola
    if (req.user.perfil !== 'SUPER_ADMIN' && req.user.perfil !== 'ADMIN_ESCOLA') {
      return res.status(403).json({ error: 'Perfil de usuário inválido para criação' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const user = await User.create({
      nome,
      email,
      password: hash,
      perfil,
      escolaId: escolaId || null, // garante que não fique undefined
    });

    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (err) {
    // Erros de validação do Sequelize
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Erro de validação', details: err.errors.map(e => e.message) });
    }

    res.status(500).json({ error: 'Erro ao criar usuário', details: err.message });
  }
};

// Listar usuários
exports.listar = async (req, res) => {
  try {
    let users;

    if (req.user.perfil === 'SUPER_ADMIN') {
      users = await User.findAll({
        attributes: ['id', 'nome', 'email', 'perfil', 'escolaId']
      });
    } else if (req.user.perfil === 'ADMIN_ESCOLA') {
      users = await User.findAll({
        where: { escolaId: req.user.escolaId },
        attributes: ['id', 'nome', 'email', 'perfil', 'escolaId']
      });
    } else {
      return res.status(403).json({ error: 'Perfil de usuário inválido' });
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários', details: err.message });
  }
};

// Obter usuário por ID
exports.obter = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'nome', 'email', 'perfil', 'escolaId']
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && user.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter usuário', details: err.message });
  }
};

// Atualizar usuário
exports.atualizar = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && user.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (req.body.senha) {
      req.body.password = await bcrypt.hash(req.body.senha, 10);
      delete req.body.senha;
    }

    if (req.body.perfil && !perfisValidos.includes(req.body.perfil)) {
      return res.status(400).json({ error: `Perfil inválido. Perfis válidos: ${perfisValidos.join(', ')}` });
    }

    await user.update(req.body);
    res.json({ message: 'Usuário atualizado com sucesso', user });
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Erro de validação', details: err.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Erro ao atualizar usuário', details: err.message });
  }
};

// Remover usuário
exports.remover = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && user.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await user.destroy();
    res.json({ message: 'Usuário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover usuário', details: err.message });
  }
};