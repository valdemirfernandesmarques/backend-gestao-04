// backend/controllers/escolaController.js
const { Escola, IsencaoTaxa } = require('../models');
const { Op } = require('sequelize');

// Criar uma nova escola
exports.criar = async (req, res) => {
  try {
    const { nome, isencaoAtiva } = req.body;

    if (req.user.perfil !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Apenas SUPER_ADMIN pode criar escolas' });
    }

    const escola = await Escola.create({ nome, isencaoAtiva: isencaoAtiva ?? false });

    if (isencaoAtiva) {
      await IsencaoTaxa.create({
        escolaId: escola.id,
        motivo: 'Isenção de taxa ativada na criação da escola',
        dataInicio: new Date(),
        dataFim: new Date('2099-12-31')
      });
    }

    res.status(201).json({ message: 'Escola criada com sucesso!', escola });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar escola', details: err.message });
  }
};

// Listar escolas
exports.listar = async (req, res) => {
  try {
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      const escola = await Escola.findByPk(req.user.escolaId);
      return res.json(escola ? [escola] : []);
    }

    const escolas = await Escola.findAll();
    res.json(escolas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar escolas', details: err.message });
  }
};

// Obter escola por ID
exports.obter = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && escola.id !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(escola);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter escola', details: err.message });
  }
};

// Atualizar escola
exports.atualizar = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });

    if (req.user.perfil !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await escola.update(req.body);
    res.json({ message: 'Escola atualizada com sucesso', escola });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar escola', details: err.message });
  }
};

// Remover escola
exports.remover = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });

    if (req.user.perfil !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await escola.destroy();
    res.json({ message: 'Escola removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover escola', details: err.message });
  }
};

// Upload do logotipo
exports.uploadLogo = async (req, res) => {
  try {
    if (req.user.perfil !== 'ADMIN_ESCOLA') {
      return res.status(403).json({ error: 'Apenas ADMIN_ESCOLA pode fazer upload de logotipo.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de imagem enviado.' });
    }

    const escola = await Escola.findByPk(req.user.escolaId);
    if (!escola) return res.status(404).json({ error: 'Escola não encontrada' });

    // Salva o caminho relativo acessível pelo frontend
    escola.logoUrl = `/uploads/logos/${req.file.filename}`;
    await escola.save();

    res.json({ message: 'Logotipo atualizado com sucesso!', logoUrl: escola.logoUrl });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer upload do logotipo', details: err.message });
  }
};
