const Sequelize = require("sequelize");
const db = require("../db");
const Role = require("../role/model");

const Player = db.define("player", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Player.belongsTo(Role);
Role.hasMany(Player);

module.exports = Player;
