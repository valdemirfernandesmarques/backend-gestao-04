// backend/controllers/modalidadeController.js
const db = require('../models');

exports.createModalidade = async (req, res) => {
  try {
    const { nome, precoAula, descricao, escolaId } = req.body;

    if (!nome || precoAula === undefined || !escolaId) {
      return res.status(400).json({
        error: 'Campos obrigatórios: nome, precoAula e escolaId'
      });
    }

    const modalidade = await db.Modalidade.create({ nome, precoAula, descricao, escolaId });
    res.status(201).json({ message: 'Modalidade criada com sucesso', modalidade });
  } catch (error) {
    // ✅ MUDANÇA PRINCIPAL: LÓGICA PARA DETALHAR O ERRO DE VALIDAÇÃO
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        error: 'Erro de validação',
        details: messages
      });
    }

    // Para outros tipos de erro
    console.error("Erro detalhado no servidor:", error); // Isso vai logar o erro completo no terminal
    res.status(500).json({ error: 'Erro ao criar modalidade', details: error.message });
  }
};

// ... (o restante do arquivo continua igual, mas para garantir, aqui está ele completo)

// Listar todas as modalidades
exports.getModalidades = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      whereClause = { escolaId: req.user.escolaId };
    }
    const modalidades = await db.Modalidade.findAll({ where: whereClause });
    res.json(modalidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar modalidades', details: error.message });
  }
};

// Buscar modalidade por ID
exports.getModalidadeById = async (req, res) => {
  try {
    const modalidade = await db.Modalidade.findByPk(req.params.id);
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && modalidade.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta modalidade' });
    }
    res.json(modalidade);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar modalidade', details: error.message });
  }
};

// Atualizar modalidade
exports.updateModalidade = async (req, res) => {
  try {
    const modalidade = await db.Modalidade.findByPk(req.params.id);
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && modalidade.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta modalidade' });
    }
    const { nome, precoAula, descricao } = req.body;
    await modalidade.update({ nome, precoAula, descricao });
    res.json({ message: 'Modalidade atualizada com sucesso', modalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar modalidade', details: error.message });
  }
};

// Deletar modalidade
exports.deleteModalidade = async (req, res) => {
  try {
    const modalidade = await db.Modalidade.findByPk(req.params.id);
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && modalidade.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta modalidade' });
    }
    await modalidade.destroy();
    res.json({ message: 'Modalidade deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar modalidade', details: error.message });
  }
};