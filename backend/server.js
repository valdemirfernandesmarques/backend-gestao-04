const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const vendaRoutes = require("./routes/vendaRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const mensalidadeRoutes = require("./routes/mensalidadeRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const funcionarioRoutes = require("./routes/funcionarioRoutes"); // ✅ LINHA ADICIONADA

// Configurando rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/vendas", vendaRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/mensalidades", mensalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/pagamentos", pagamentoRoutes);
app.use("/api/funcionarios", funcionarioRoutes); // ✅ LINHA ADICIONADA

async function criarSuperAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;
    const existente = await db.User.findOne({ where: { email: adminEmail } });
    if (!existente) {
      const hash = await bcrypt.hash(adminPass, 10);
      await db.User.create({
        nome: "Super Admin", email: adminEmail, password: hash,
        perfil: "SUPER_ADMIN", escolaId: null,
      });
      console.log(`✅ Super Admin criado: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Super Admin já existe: ${adminEmail}`);
    }
  } catch (error) {
    console.error("❌ Erro ao criar Super Admin:", error);
  }
}

const PORT = process.env.PORT || 3000;

db.sequelize.sync()
  .then(async () => {
    console.log("🎯 Banco de dados sincronizado!");
    await criarSuperAdmin();
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar banco:", err);
  });
