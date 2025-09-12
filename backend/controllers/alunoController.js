const { Aluno } = require('../models');

// Criar um novo aluno
exports.createAluno = async (req, res) => {
  try {
    const { nome, cpf, email, telefone, escolaId: escolaIdBody } = req.body;

    if (!nome || !cpf || !email) {
      return res.status(400).json({
        error: 'Campos obrigatórios: nome, cpf e email'
      });
    }

    // SUPER_ADMIN pode criar aluno em qualquer escola (passada no body)
    const escolaId = req.user.perfil === 'SUPER_ADMIN' ? escolaIdBody || null : req.user.escolaId;

    if (!escolaId) {
      return res.status(403).json({ error: 'Usuário não pertence a nenhuma escola' });
    }

    // ADMIN_ESCOLA não pode criar alunos em outra escola
    if (req.user.perfil === 'ADMIN_ESCOLA' && escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado: você não pode criar aluno em outra escola' });
    }

    const aluno = await Aluno.create({ nome, cpf, email, telefone, escolaId });

    res.status(201).json({ message: 'Aluno criado com sucesso', aluno });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar aluno', details: error.message });
  }
};

// Listar todos os alunos
exports.getAlunos = async (req, res) => {
  try {
    const whereClause = req.user.perfil === 'ADMIN_ESCOLA' ? { escolaId: req.user.escolaId } : {};
    const alunos = await Aluno.findAll({ where: whereClause });
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos', details: error.message });
  }
};

// Buscar aluno por ID
exports.getAlunoById = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });

    // ADMIN_ESCOLA só pode acessar alunos de sua própria escola
    if (req.user.perfil === 'ADMIN_ESCOLA' && aluno.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este aluno' });
    }

    // SUPER_ADMIN pode acessar qualquer aluno
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aluno', details: error.message });
  }
};

// Atualizar aluno
exports.updateAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && aluno.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este aluno' });
    }

    const { nome, cpf, email, telefone } = req.body;
    await aluno.update({ nome, cpf, email, telefone });
    res.json({ message: 'Aluno atualizado com sucesso', aluno });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno', details: error.message });
  }
};

// Deletar aluno
exports.deleteAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });

    if (req.user.perfil === 'ADMIN_ESCOLA' && aluno.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este aluno' });
    }

    await aluno.destroy();
    res.json({ message: 'Aluno deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aluno', details: error.message });
  }
};
