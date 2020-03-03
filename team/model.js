const Sequelize = require("sequelize");
const Player = require("../player/model");
const db = require("../db");

const Team = db.define("team", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Player.belongsTo(Team);
Team.hasMany(Player);

module.exports = Team;
