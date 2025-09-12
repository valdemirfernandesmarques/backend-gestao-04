// models/IsencaoTaxa.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Escola = require("./Escola");

const IsencaoTaxa = sequelize.define("IsencaoTaxa", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  escolaId: {
    type: DataTypes.INTEGER,
    allowNull: true, // se null, significa isenção global
    references: {
      model: Escola,
      key: "id"
    }
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  dataInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dataFim: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: "isencoes_taxa",
  timestamps: true
});

module.exports = IsencaoTaxa;
