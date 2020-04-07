const getUserRole = user =>
  user.organisation ? user.organisation.roleId : user.roleId;

const canEditSpirit = (spiritScoreFor, user, game, userRoleId) => {
  if (userRoleId === spiritCaptain || userRoleId === teamCaptain) {
    if (
      (spiritScoreFor === "home" && user.teamId === game.awayTeamId) ||
      (spiritScoreFor === "away" && user.teamId === game.homeTeamId)
    ) {
      return true;
    }
  } else if (userRoleId === clubBoard) {
    if (
      (spiritScoreFor === "home" &&
        game.awayTeam.organisationId === user.organisationId) ||
      (spiritScoreFor === "away" &&
        game.homeTeam.organisationId === user.organisationId)
    ) {
      return true;
    }
  } else return false;
};

module.exports = { getUserRole, canEditSpirit };
