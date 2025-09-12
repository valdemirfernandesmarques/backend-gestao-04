// backend/controllers/professorModalidadeController.js
const Professor = require('../models/Professor');
const Modalidade = require('../models/Modalidade');

exports.vincular = async (req, res) => {
  try {
    const { professorId, modalidadeId } = req.body;

    const professor = await Professor.findByPk(professorId);
    const modalidade = await Modalidade.findByPk(modalidadeId);

    if (!professor || !modalidade) {
      return res.status(404).json({ error: 'Professor ou Modalidade não encontrados' });
    }

    await professor.addModalidade(modalidade);

    res.json({ message: 'Vínculo criado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao vincular professor e modalidade', details: error.message });
  }
};

exports.listarModalidadesDoProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.professorId, {
      include: { model: Modalidade, as: 'modalidades' }
    });

    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });

    res.json(professor.modalidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar modalidades', details: error.message });
  }
};

exports.listarProfessoresDaModalidade = async (req, res) => {
  try {
    const modalidade = await Modalidade.findByPk(req.params.modalidadeId, {
      include: { model: Professor, as: 'professores' }
    });

    if (!modalidade) return res.status(404).json({ error: 'Modalidade não encontrada' });

    res.json(modalidade.professores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar professores', details: error.message });
  }
};
