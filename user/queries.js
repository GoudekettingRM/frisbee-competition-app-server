const User = require("./model");
const { userInclude } = require("../helper-files/include-definitions");

const createUser = async userData => {
  return await User.create(userData);
};

const getSpecificUser = async userId => {
  return await User.findByPk(userId, userInclude);
};

const getOneUser = async whereQuery => {
  return await User.findOne({ where: whereQuery }, userInclude);
};

const updateUser = async (updateData, userId) => {
  return await User.update(updateData, { where: { id: userId } });
};

module.exports = { updateUser, createUser, getSpecificUser, getOneUser };
