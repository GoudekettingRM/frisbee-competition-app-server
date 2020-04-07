const Sequelize = require("sequelize");
const db = require("../db");

const CompetitionDay = db.define("competitionDay", {
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  }
});

module.exports = CompetitionDay;
