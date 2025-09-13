const db = require('../models');

// ... (a função 'vincular' e as de listagem continuam iguais)
exports.vincular = async (req, res) => {
  try {
    const { professorId, modalidadeId } = req.body;
    const professor = await db.Professor.findByPk(professorId);
    const modalidade = await db.Modalidade.findByPk(modalidadeId);

    if (!professor || !modalidade) {
      return res.status(404).json({ error: 'Professor ou Modalidade não encontrados' });
    }
    if (professor.escolaId !== modalidade.escolaId) {
        return res.status(400).json({ error: 'Professor e Modalidade devem pertencer à mesma escola.' });
    }
    if (req.user.perfil === 'ADMIN_ESCOLA' && professor.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado. Você só pode vincular professores da sua escola.' });
    }
    await professor.addModalidade(modalidade);
    res.json({ message: 'Vínculo criado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao vincular professor e modalidade', details: error.message });
  }
};

// ✅ CORRIGIDO: Agora lê os IDs da URL (req.query)
exports.desvincular = async (req, res) => {
    try {
        const { professorId, modalidadeId } = req.query; // <-- MUDANÇA PRINCIPAL

        if (!professorId || !modalidadeId) {
            return res.status(400).json({ error: 'É necessário fornecer professorId e modalidadeId como parâmetros na URL.' });
        }

        const professor = await db.Professor.findByPk(professorId);
        const modalidade = await db.Modalidade.findByPk(modalidadeId);

        if (!professor || !modalidade) {
            return res.status(404).json({ error: 'Professor ou Modalidade não encontrados' });
        }

        if (req.user.perfil === 'ADMIN_ESCOLA' && professor.escolaId !== req.user.escolaId) {
            return res.status(403).json({ error: 'Acesso negado.' });
        }

        await professor.removeModalidade(modalidade);
        res.json({ message: 'Vínculo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao desvincular professor e modalidade', details: error.message });
    }
};

exports.listarModalidadesDoProfessor = async (req, res) => {
  try {
    const professor = await db.Professor.findByPk(req.params.professorId, {
      include: { model: db.Modalidade, as: 'modalidades' }
    });
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
    res.json(professor.modalidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar modalidades', details: error.message });
  }
};

exports.listarProfessoresDaModalidade = async (req, res) => {
  try {
    const modalidade = await db.Modalidade.findByPk(req.params.modalidadeId, {
      include: { model: db.Professor, as: 'professores' }
    });
    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });
    res.json(modalidade.professores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar professores', details: error.message });
  }
};
