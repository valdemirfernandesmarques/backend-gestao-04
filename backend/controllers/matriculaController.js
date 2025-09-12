// backend/controllers/matriculaController.js
const db = require('../models');

const criarMatricula = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { alunoId, turmaId, dataInicio } = req.body;
    const escolaId = req.user.perfil === 'SUPER_ADMIN' ? req.body.escolaId : req.user.escolaId;

    if (!alunoId || !turmaId || !escolaId) {
      return res.status(400).json({ error: 'Campos obrigatórios: alunoId, turmaId e escolaId.' });
    }

    const turma = await db.Turma.findByPk(turmaId, { include: [{ model: db.Modalidade, as: 'modalidade' }] });
    if (!turma) return res.status(404).json({ error: 'Turma não encontrada.' });
    if (!turma.modalidade || !turma.modalidade.precoAula || parseFloat(turma.modalidade.precoAula) <= 0) {
      return res.status(400).json({ error: 'A modalidade desta turma não possui um preço de aula configurado.' });
    }

    const matricula = await db.Matricula.create({
      alunoId, turmaId, escolaId,
      dataInicio: dataInicio || new Date(), status: 'ATIVA'
    }, { transaction: t });

    // ✅ CORRIGIDO: Passa o 'escolaId' ao criar a mensalidade
    await db.Mensalidade.create({
      matriculaId: matricula.id,
      escolaId: matricula.escolaId, // Pega o ID da escola da matrícula
      valor: turma.modalidade.precoAula,
      dataVencimento: new Date(),
      status: 'PENDENTE'
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Matrícula e primeira mensalidade geradas com sucesso!', matricula });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Erro ao criar matrícula', details: error.message });
  }
};

// ... (o restante do arquivo continua o mesmo)
const { Op } = require('sequelize');

const listarMatriculas = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.perfil === 'ADMIN_ESCOLA') {
        whereClause.escolaId = req.user.escolaId;
    }
    const matriculas = await db.Matricula.findAll({
      where: whereClause,
      include: [ { model: db.Aluno, as: 'aluno' }, { model: db.Turma, as: 'turma' } ]
    });
    res.json(matriculas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar matrículas', details: error.message });
  }
};

const obterMatricula = async (req, res) => {
  try {
    const matricula = await db.Matricula.findByPk(req.params.id, {
      include: [ { model: db.Aluno, as: 'aluno' }, { model: db.Turma, as: 'turma' }, { model: db.Mensalidade, as: 'mensalidades' } ]
    });
    if (!matricula) return res.status(404).json({ error: 'Matrícula não encontrada' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && matricula.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado a esta matrícula.' });
    }
    res.json(matricula);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar matrícula', details: error.message });
  }
};

const atualizarMatricula = async (req, res) => {
  try {
    const matricula = await db.Matricula.findByPk(req.params.id);
    if (!matricula) return res.status(404).json({ error: 'Matrícula não encontrada' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && matricula.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado a esta matrícula.' });
    }
    const { status } = req.body;
    await matricula.update({ status });
    res.json({ message: 'Matrícula atualizada com sucesso!', matricula });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar matrícula', details: error.message });
  }
};

const deletarMatricula = async (req, res) => {
  try {
    const matricula = await db.Matricula.findByPk(req.params.id);
    if (!matricula) return res.status(404).json({ error: 'Matrícula não encontrada' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && matricula.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado a esta matrícula.' });
    }
    await matricula.destroy();
    res.json({ message: 'Matrícula deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar matrícula', details: error.message });
  }
};

module.exports = { criarMatricula, listarMatriculas, obterMatricula, atualizarMatricula, deletarMatricula };