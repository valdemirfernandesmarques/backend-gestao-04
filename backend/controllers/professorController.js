// backend/controllers/professorController.js
const db = require('../models'); // ✅ CORRIGIDO: Importa o banco de dados inteiro

exports.criarProfessor = async (req, res) => {
  try {
    // ✅ CORRIGIDO: Campos alinhados com o novo Model
    const { nome, cpf, email, telefone, endereco, vinculo, escolaId } = req.body;

    // Validação
    if (!nome || !cpf || !vinculo || !escolaId) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome, cpf, vinculo e escolaId.' });
    }

    // ✅ CORRIGIDO: Usa db.Professor para acessar o model
    const professor = await db.Professor.create({
      nome,
      cpf,
      email,
      telefone,
      endereco,
      vinculo,
      escolaId
    });

    res.status(201).json({
      message: 'Professor criado com sucesso!',
      professor
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar professor', details: error.message });
  }
};

exports.listarProfessores = async (req, res) => {
  try {
    // ✅ CORRIGIDO: Usa db.Professor
    const professores = await db.Professor.findAll();
    res.json(professores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar professores', details: error.message });
  }
};

exports.obterProfessor = async (req, res) => {
  try {
    // ✅ CORRIGIDO: Usa db.Professor
    const professor = await db.Professor.findByPk(req.params.id);
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter professor', details: error.message });
  }
};

exports.atualizarProfessor = async (req, res) => {
  try {
    // ✅ CORRIGIDO: Usa db.Professor
    const professor = await db.Professor.findByPk(req.params.id);
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });

    await professor.update(req.body);

    res.json({ message: 'Professor atualizado com sucesso!', professor });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar professor', details: error.message });
  }
};

exports.deletarProfessor = async (req, res) => {
  try {
    // ✅ CORRIGIDO: Usa db.Professor
    const professor = await db.Professor.findByPk(req.params.id);
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });

    await professor.destroy();
    res.json({ message: 'Professor deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar professor', details: error.message });
  }
};