// backend/controllers/mensalidadeController.js
const db = require('../models');

// Criar mensalidade (geralmente chamado por outra função, como a de matrícula)
const criarMensalidade = async (dados, transaction) => {
  return db.Mensalidade.create(dados, { transaction });
};

// Listar todas as mensalidades
const listarMensalidades = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      whereClause.escolaId = req.user.escolaId;
    }

    const mensalidades = await db.Mensalidade.findAll({
      where: whereClause,
      include: [
        {
          model: db.Matricula,
          as: 'matricula', // Apelido para a matrícula
          include: [
            // ✅ CORRIGIDO: Adicionado o 'as: "aluno"' que faltava
            { model: db.Aluno, as: 'aluno' },
            { model: db.Turma, as: 'turma' }
          ]
        }
      ]
    });

    res.json(mensalidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar mensalidades', details: error.message });
  }
};

// Obter mensalidade por ID
const obterMensalidade = async (req, res) => {
  try {
    const mensalidade = await db.Mensalidade.findByPk(req.params.id, {
      include: [
        {
          model: db.Matricula,
          as: 'matricula',
          include: [
             // ✅ CORRIGIDO: Adicionado o 'as: "aluno"' que faltava
            { model: db.Aluno, as: 'aluno' },
            { model: db.Turma, as: 'turma' }
          ]
        }
      ]
    });

    if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado a esta mensalidade.' });
    }

    res.json(mensalidade);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensalidade', details: error.message });
  }
};

// Atualizar mensalidade
const atualizarMensalidade = async (req, res) => {
  try {
    const mensalidade = await db.Mensalidade.findByPk(req.params.id);
    if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado a esta mensalidade.' });
    }
    
    // Apenas campos permitidos para atualização
    const { dataVencimento, status, valor } = req.body;
    await mensalidade.update({ dataVencimento, status, valor });

    res.json({ message: 'Mensalidade atualizada com sucesso!', mensalidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar mensalidade', details: error.message });
  }
};

// Deletar mensalidade
const deletarMensalidade = async (req, res) => {
  try {
    const mensalidade = await db.Mensalidade.findByPk(req.params.id);
    if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado a esta mensalidade.' });
    }

    await mensalidade.destroy();
    res.json({ message: 'Mensalidade deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar mensalidade', details: error.message });
  }
};

module.exports = {
  criarMensalidade, // Exportando para uso interno (pelo matriculaController)
  listarMensalidades,
  obterMensalidade,
  atualizarMensalidade,
  deletarMensalidade,
};