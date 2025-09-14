// backend/models/Associacoes.js
const { Escola, User, Professor, Modalidade, Turma, Aluno, Matricula, Mensalidade, Pagamento } = require('../models');

// =========================
// Escola ↔ Usuários
// =========================
Escola.hasMany(User, { as: 'usuarios', foreignKey: 'escolaId' });
User.belongsTo(Escola, { as: 'escola', foreignKey: 'escolaId' });

// =========================
// Escola ↔ Professores
// =========================
Escola.hasMany(Professor, { as: 'professores', foreignKey: 'escolaId' });
Professor.belongsTo(Escola, { as: 'escola', foreignKey: 'escolaId' });

// =========================
// Escola ↔ Modalidades
// =========================
Escola.hasMany(Modalidade, { as: 'modalidades', foreignKey: 'escolaId' });
Modalidade.belongsTo(Escola, { as: 'escola', foreignKey: 'escolaId' });

// =========================
// Modalidade ↔ Turmas
// =========================
Modalidade.hasMany(Turma, { as: 'turmas', foreignKey: 'modalidadeId' });
Turma.belongsTo(Modalidade, { as: 'modalidade', foreignKey: 'modalidadeId' });

// =========================
// Escola ↔ Turmas
// =========================
Escola.hasMany(Turma, { as: 'turmas', foreignKey: 'escolaId' });
Turma.belongsTo(Escola, { as: 'escola', foreignKey: 'escolaId' });

// =========================
// Escola ↔ Alunos
// =========================
Escola.hasMany(Aluno, { as: 'alunos', foreignKey: 'escolaId' });
Aluno.belongsTo(Escola, { as: 'escola', foreignKey: 'escolaId' });

// =========================
// Turma ↔ Matrículas
// =========================
Turma.hasMany(Matricula, { as: 'matriculas', foreignKey: 'turmaId' });
Matricula.belongsTo(Turma, { as: 'turma', foreignKey: 'turmaId' });

// =========================
// Aluno ↔ Matrículas
// =========================
Aluno.hasMany(Matricula, { as: 'matriculas', foreignKey: 'alunoId' });
Matricula.belongsTo(Aluno, { as: 'aluno', foreignKey: 'alunoId' });

// =========================
// Matrícula ↔ Mensalidades
// =========================
Matricula.hasMany(Mensalidade, { as: 'mensalidades', foreignKey: 'matriculaId' });
Mensalidade.belongsTo(Matricula, { as: 'matricula', foreignKey: 'matriculaId' });

// =========================
// Mensalidade ↔ Pagamentos
// =========================
Mensalidade.hasMany(Pagamento, { as: 'pagamentos', foreignKey: 'mensalidadeId' });
Pagamento.belongsTo(Mensalidade, { as: 'mensalidade', foreignKey: 'mensalidadeId' });

// =========================
// ✅ NOVO: Adicionando a associação Pagamento ↔ Escola
// =========================
Escola.hasMany(Pagamento, { as: 'pagamentos', foreignKey: 'escolaId' });
Pagamento.belongsTo(Escola, { as: 'escola', foreignKey: 'escolaId' });

module.exports = {
  Escola,
  User,
  Professor,
  Modalidade,
  Turma,
  Aluno,
  Matricula,
  Mensalidade,
  Pagamento
};