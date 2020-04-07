const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const { return403, return409 } = require("../helper-files/returnStatusCodes");
const {
  getUserRole,
  canEditSpirit
} = require("../helper-files/role-validations/rbac-helpers");
const { getGame } = require("../game/queries");
const {
  updateGameSpiritId,
  createNewSpirit,
  updateSpirit
} = require("./queries");
const {
  teamCaptain,
  spiritCaptain,
  federation,
  clubBoard,
  superAdmin
} = require("../helper-files/role-validations/endpointRoles");

const router = new Router();

router.post("/spirit-scores", auth, async (req, res, next) => {
  try {
    const admins = [federation, superAdmin];
    const teamUsers = [spiritCaptain, teamCaptain, clubBoard];
    const userRoleId = getUserRole(req.user);
    const {
      RKUScore,
      FNBScore,
      FMScore,
      PASCScore,
      COMMScore,
      gameId,
      spiritScoreFor
    } = req.body;
    const spiritTotal = RKUScore + FNBScore + FMScore + PASCScore + COMMScore;
    const spiritDataWithTotal = { ...req.body, spiritTotal };
    const gameToScore = await getGame(gameId);

    if (admins.includes(userRoleId)) {
      if (spiritScoreFor === "home") {
        if (gameToScore.homeTeamReceivedSpiritScoreId) {
          return return409(res);
        } else {
          const spiritData = {
            ...spiritDataWithTotal,
            teamId: gameToScore.homeTeamId
          };
          const newSpiritScore = await createNewSpirit(spiritData);
          await updateGameSpiritId(spiritScoreFor, newSpiritScore.id, gameId);
          const updatedGame = await getGame(gameId);

          return res.json({
            message: "Spirit score added successfully",
            updatedGame
          });
        }
      } else {
        if (gameToScore.awayTeamReceivedSpiritScoreId) {
          return return409(res);
        } else {
          const spiritData = {
            ...spiritDataWithTotal,
            teamId: gameToScore.awayTeamId
          };
          const newSpiritScore = await createNewSpirit(spiritData);
          await updateGameSpiritId(spiritScoreFor, newSpiritScore.id, gameId);
          const updatedGame = await getGame(gameId);

          return res.json({
            message: "Spirit score added successfully",
            updatedGame
          });
        }
      }
    } else if (teamUsers.includes(userRoleId)) {
      if (req.user.teamId === gameToScore.homeTeamId) {
        if (gameToScore.awayTeamReceivedSpiritScoreId) {
          return return409(res);
        } else {
          const spiritData = {
            ...spiritDataWithTotal,
            teamId: gameToScore.awayTeamId
          };
          const newSpiritScore = await createNewSpirit(spiritData);
          await updateGameSpiritId("away", newSpiritScore.id, gameId);
          const updatedGame = await getGame(gameId);

          return res.json({
            message: "Spirit score added successfully",
            updatedGame
          });
        }
      } else if (req.user.teamId === gameToScore.awayTeamId) {
        if (gameToScore.homeTeamReceivedSpiritScoreId) {
          return return409(res);
        } else {
          const spiritData = {
            ...spiritDataWithTotal,
            teamId: gameToScore.homeTeamId
          };
          const newSpiritScore = await createNewSpirit(spiritData);
          await updateGameSpiritId("home", newSpiritScore.id, gameId);
          const updatedGame = await getGame(gameId);

          return res.json({
            message: "Spirit score added successfully",
            updatedGame
          });
        }
      } else {
        return return403(res);
      }
    } else {
      return return403(res);
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/spirit-scores/:id", auth, async (req, res, next) => {
  try {
    const admins = [federation, superAdmin];
    const teamUsers = [spiritCaptain, teamCaptain, clubBoard];
    const spiritScoreId = req.params.id;
    const userRoleId = getUserRole(req.user);

    const {
      RKUScore,
      FNBScore,
      FMScore,
      PASCScore,
      COMMScore,
      gameId,
      spiritScoreFor
    } = req.body;
    const spiritTotal = RKUScore + FNBScore + FMScore + PASCScore + COMMScore;

    const updatedSpiritData = {
      ...req.body,
      spiritTotal
    };

    if (admins.includes(userRoleId)) {
      await updateSpirit(updatedSpiritData, spiritScoreId);
      const updatedGame = await getGame(gameId);
      return res.json({
        message: "Spirit score updated successfully",
        updatedGame
      });
    } else if (teamUsers.includes(userRoleId)) {
      const game = await getGame(gameId);
      if (canEditSpirit(spiritScoreFor, req.user, game, userRoleId)) {
        await updateSpirit(updatedSpiritData, spiritScoreId);
        const updatedGame = await getGame(gameId);
        return res.json({
          message: "Spirit score updated successfully",
          updatedGame
        });
      } else return return403(res);
    } else return return403(res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
