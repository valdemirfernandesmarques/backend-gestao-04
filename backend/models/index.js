// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Configuração do Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || "gestao_danca",
  process.env.DB_USER || "root",
  process.env.DB_PASS !== undefined ? process.env.DB_PASS : "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
    timezone: "-03:00",
  }
);

// Teste de conexão
sequelize.authenticate()
  .then(() => console.log("Conexão com MySQL OK!"))
  .catch(err => console.error("Erro de conexão:", err));

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ===== Carrega models =====
db.Escola               = require("./Escola")(sequelize, DataTypes);
db.User                 = require("./User")(sequelize, DataTypes);
db.Aluno                = require("./Aluno")(sequelize, DataTypes);
db.Professor            = require("./Professor")(sequelize, DataTypes);
db.Funcionario          = require("./Funcionario")(sequelize, DataTypes);
db.Modalidade           = require("./Modalidade")(sequelize, DataTypes);
db.Turma                = require("./Turma")(sequelize, DataTypes);
db.Matricula            = require("./Matricula")(sequelize, DataTypes);
db.Mensalidade          = require("./Mensalidade")(sequelize, DataTypes);
db.Pagamento            = require("./Pagamento")(sequelize, DataTypes);
db.Comissao             = require("./Comissao")(sequelize, DataTypes);
db.Produto              = require("./Produto")(sequelize, DataTypes);
db.Venda                = require("./Venda")(sequelize, DataTypes);
db.VendaItem            = require("./VendaItem")(sequelize, DataTypes);
db.ProfessorModalidade  = require("./ProfessorModalidade")(sequelize, DataTypes); // ✅ LINHA ADICIONADA

// ======================= ASSOCIAÇÕES =======================
// Roda as associações de cada modelo, se a função 'associate' existir
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;