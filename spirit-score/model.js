const Sequelize = require("sequelize");
const db = require("../db");
const Team = require("../team/model");

const SpiritScore = db.define("spiritScore", {
  RKUScore: Sequelize.INTEGER,
  RKUComment: Sequelize.TEXT,
  FNBScore: Sequelize.INTEGER,
  FNBComment: Sequelize.TEXT,
  FMScore: Sequelize.INTEGER,
  FMComment: Sequelize.TEXT,
  PASCScore: Sequelize.INTEGER,
  PASCComment: Sequelize.TEXT,
  COMMScore: Sequelize.INTEGER,
  COMMComment: Sequelize.TEXT,
  generalComment: Sequelize.TEXT
});

SpiritScore.belongsTo(Team);
Team.hasMany(SpiritScore);

module.exports = SpiritScore;
