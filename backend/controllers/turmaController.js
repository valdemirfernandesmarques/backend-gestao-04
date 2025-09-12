// backend/controllers/turmaController.js
const db = require('../models');

exports.createTurma = async (req, res) => {
  try {
    // ✅ CORRIGIDO: Recebendo os campos corretos do corpo da requisição
    const { nome, horarioInicio, horarioFim, diaDaSemana, maxAlunos, modalidadeId, professorId } = req.body;

    const escolaId = req.user.perfil === 'SUPER_ADMIN' ? req.body.escolaId : req.user.escolaId;

    if (!nome || !modalidadeId || !professorId || !escolaId) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome, modalidadeId, professorId e escolaId.' });
    }

    const turma = await db.Turma.create({
      nome,
      horarioInicio,
      horarioFim,
      diaDaSemana,
      maxAlunos,
      modalidadeId,
      professorId,
      escolaId
    });

    res.status(201).json({ message: 'Turma criada com sucesso', turma });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar turma', details: error.message });
  }
};

// ... (o restante do controller continua o mesmo)
exports.getTurmas = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.perfil === 'ADMIN_ESCOLA') {
        whereClause.escolaId = req.user.escolaId;
    }

    const turmas = await db.Turma.findAll({
      where: whereClause,
      include: [
        { model: db.Professor, as: 'professor' },
        { model: db.Modalidade, as: 'modalidade' }
      ]
    });
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar turmas', details: error.message });
  }
};

exports.getTurmaById = async (req, res) => {
  try {
    const turma = await db.Turma.findByPk(req.params.id, {
      include: [
        { model: db.Professor, as: 'professor' },
        { model: db.Modalidade, as: 'modalidade' }
      ]
    });
    if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && turma.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado a esta turma.' });
    }

    res.json(turma);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar turma', details: error.message });
  }
};

exports.updateTurma = async (req, res) => {
  try {
    const turma = await db.Turma.findByPk(req.params.id);
    if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && turma.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado a esta turma.' });
    }

    await turma.update(req.body);
    res.json({ message: 'Turma atualizada com sucesso', turma });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar turma', details: error.message });
  }
};

exports.deleteTurma = async (req, res) => {
  try {
    const turma = await db.Turma.findByPk(req.params.id);
    if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && turma.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado a esta turma.' });
    }

    await turma.destroy();
    res.json({ message: 'Turma deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar turma', details: error.message });
  }
};