const db = require('../models');

// Criar um novo funcionário
exports.criarFuncionario = async (req, res) => {
  try {
    const { nomeCompleto, nomeSocial } = req.body;
    let escolaIdFinal;

    if (req.user.perfil === 'SUPER_ADMIN') {
      const { escolaId } = req.body;
      escolaIdFinal = escolaId || null; // SUPER_ADMIN pode ou não associar a uma escola
    } else {
      escolaIdFinal = req.user.escolaId;
    }

    if (!nomeCompleto) {
      return res.status(400).json({ error: 'O campo nomeCompleto é obrigatório.' });
    }

    const funcionario = await db.Funcionario.create({
      nomeCompleto,
      nomeSocial,
      escolaId: escolaIdFinal
    });

    res.status(201).json({ message: 'Funcionário criado com sucesso', funcionario });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar funcionário', details: error.message });
  }
};

// Listar todos os funcionários
exports.listarFuncionarios = async (req, res) => {
  try {
    let where = {};
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      where.escolaId = req.user.escolaId;
    }

    const funcionarios = await db.Funcionario.findAll({ where });
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar funcionários', details: error.message });
  }
};

// Obter um funcionário por ID
exports.obterFuncionario = async (req, res) => {
  try {
    const funcionario = await db.Funcionario.findByPk(req.params.id);
    if (!funcionario) return res.status(404).json({ error: 'Funcionário não encontrado' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && funcionario.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este funcionário' });
    }
    res.json(funcionario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter funcionário', details: error.message });
  }
};

// Atualizar um funcionário
exports.atualizarFuncionario = async (req, res) => {
  try {
    const funcionario = await db.Funcionario.findByPk(req.params.id);
    if (!funcionario) return res.status(404).json({ error: 'Funcionário não encontrado' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && funcionario.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este funcionário' });
    }
    await funcionario.update(req.body);
    res.json({ message: 'Funcionário atualizado com sucesso', funcionario });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar funcionário', details: error.message });
  }
};

// Deletar um funcionário
exports.deletarFuncionario = async (req, res) => {
  try {
    const funcionario = await db.Funcionario.findByPk(req.params.id);
    if (!funcionario) return res.status(404).json({ error: 'Funcionário não encontrado' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && funcionario.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este funcionário' });
    }
    await funcionario.destroy();
    res.json({ message: 'Funcionário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover funcionário', details: error.message });
  }
};
