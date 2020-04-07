const Role = require("./model");

const createRole = async roleData => {
  return await Role.create(roleData);
};

module.exports = { createRole };
