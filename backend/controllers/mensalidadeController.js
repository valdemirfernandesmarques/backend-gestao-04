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
  const t = await db.sequelize.transaction();
  try {
    const mensalidade = await db.Mensalidade.findByPk(req.params.id, { transaction: t });
    if (!mensalidade) {
      await t.rollback();
      return res.status(404).json({ error: 'Mensalidade não encontrada' });
    }

    if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
      await t.rollback();
      return res.status(403).json({ error: 'Acesso negado a esta mensalidade.' });
    }
    
    const { dataVencimento, status, valor } = req.body;
    await mensalidade.update({ dataVencimento, status, valor }, { transaction: t });

    // ✅ NOVO: Lógica para gerar o pagamento e a comissão se o status for 'PAGO'
    if (status === 'PAGO' && mensalidade.status !== 'PAGO') {
      // 1. Encontrar o pagamento existente, se houver
      let pagamento = await db.Pagamento.findOne({ 
        where: { mensalidadeId: mensalidade.id },
        transaction: t
      });
      
      // 2. Se não houver pagamento, crie um novo
      if (!pagamento) {
        pagamento = await db.Pagamento.create({
          mensalidadeId: mensalidade.id,
          escolaId: mensalidade.escolaId,
          valor: mensalidade.valor,
          dataPagamento: new Date(),
          metodo: 'PIX' // Ou qualquer outro método padrão
        }, { transaction: t });
      }

      const matricula = await db.Matricula.findByPk(mensalidade.matriculaId, {
        include: [{ model: db.Turma, as: 'turma' }],
        transaction: t
      });
      
      const professor = await db.Professor.findByPk(matricula.turma.professorId, { transaction: t });
      
      // 3. Se o professor for por comissão, crie a comissão usando o ID do novo pagamento
      if (professor && professor.vinculo === 'COMISSAO') {
        const valorComissao = mensalidade.valor * 0.10; // 10% de comissão
        await db.Comissao.create({
          pagamentoId: pagamento.id,
          professorId: professor.id,
          valor: valorComissao,
        }, { transaction: t });
      }
    }
    
    await t.commit();
    res.json({ message: 'Mensalidade atualizada com sucesso!', mensalidade });
  } catch (error) {
    await t.rollback();
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
