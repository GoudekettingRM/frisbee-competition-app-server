const getUserRole = user =>
  user.organisation ? user.organisation.roleId : user.roleId;

module.exports = { getUserRole };
