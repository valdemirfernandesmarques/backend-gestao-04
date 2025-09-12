const { Escola } = require('../models');

// Criar uma nova escola
exports.criar = async (req, res) => {
  try {
    const { nome, isencaoAtiva } = req.body;

    // Apenas SUPER_ADMIN pode criar escolas
    if (req.user.perfil !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Apenas SUPER_ADMIN pode criar escolas' });
    }

    const escola = await Escola.create({ nome, isencaoAtiva: isencaoAtiva ?? false });
    res.status(201).json(escola);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar escola', details: err.message });
  }
};

// Listar todas as escolas
exports.listar = async (req, res) => {
  try {
    // ADMIN_ESCOLA vê apenas sua própria escola
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      const escola = await Escola.findByPk(req.user.escolaId);
      return res.json(escola ? [escola] : []);
    }

    // SUPER_ADMIN vê todas as escolas
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

    // ADMIN_ESCOLA só pode acessar sua própria escola
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

    // Apenas SUPER_ADMIN pode atualizar qualquer escola
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

    // Apenas SUPER_ADMIN pode remover escolas
    if (req.user.perfil !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await escola.destroy();
    res.json({ message: 'Escola removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover escola', details: err.message });
  }
};
