// backend/seedAdminEscola.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./models");

async function seedAdminEscola() {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Conexão com o banco estabelecida!");

    // Dados fixos do admin de demonstração
    const email = "admin@escolateste.com";
    const senha = "escolateste123";
    const nome = "Admin Escola Teste";

    // Verifica se já existe a escola de teste
    let escola = await db.Escola.findOne({ where: { nome: "Escola Teste" } });

    if (!escola) {
      escola = await db.Escola.create({
        nome: "Escola Teste",
        cnpj: "00000000000191", // fictício válido
        email: "contato@escolateste.com",
      });
      console.log("🏫 Escola Teste criada!");
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Procura se já existe usuário com esse e-mail
    let admin = await db.User.findOne({ where: { email } });

    if (!admin) {
      await db.User.create({
        nome,
        email,
        password: hashedPassword,
        perfil: "ADMIN_ESCOLA", // mantém como ADMIN_ESCOLA
        escolaId: escola.id,
      });
      console.log(`✅ Admin Escola Teste criado: ${email}`);
    } else {
      admin.password = hashedPassword;
      admin.nome = nome;
      admin.perfil = "ADMIN_ESCOLA"; // garante perfil correto
      admin.escolaId = escola.id;
      await admin.save();
      console.log(`🔄 Admin Escola Teste atualizado: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar/atualizar Admin Escola Teste:", error);
    process.exit(1);
  }
}

seedAdminEscola();
