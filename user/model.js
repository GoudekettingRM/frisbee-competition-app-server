const Sequelize = require("sequelize");
const db = require("../db");
const Role = require("../role/model");
const Team = require("../team/model");

const User = db.define("user", {
  organisationName: {
    type: Sequelize.STRING,
    allowNull: false
  },
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

User.belongsTo(Role);
Role.hasMany(User);
User.belongsTo(Team);
Team.hasMany(User);

module.exports = User;
