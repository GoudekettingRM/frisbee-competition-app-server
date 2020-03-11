const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const SpiritScore = require("../spirit-score/model");
const Game = require("../game/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");
const Team = require("../team/model");
const { return403, return409 } = require("../returnStatusCodes");
const {
  teamCaptain,
  spiritCaptain,
  federation,
  clubBoard,
  superAdmin
} = require("../endpointRoles");

async function createSpiritScoreInDbAndSendResponse(
  res,
  spiritTotal,
  spiritForTeamId
) {
  const spiritData = {
    ...req.body,
    spiritTotal,
    teamId: spiritForTeamId
  };
  const newSpiritScore = await SpiritScore.create(spiritData);
  await gameToScore.update({
    homeTeamReceivedSpiritScoreId: newSpiritScore.id,
    homeTeamScore: req.body.homeTeamScore,
    awayTeamScore: req.body.awayTeamScore
  });

  const updatedGame = await Game.findByPk(gameId, {
    include: [
      Competition,
      { model: Team, as: "homeTeam" },
      { model: Team, as: "awayTeam" },
      CompetitionDay,
      { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
      { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
    ]
  });

  res.json(updatedGame);
}

const router = new Router();

router.post("/games/:id", auth, async (req, res, next) => {
  try {
    console.log("req.body:", req.body);
    const admins = [federation, superAdmin];
    const teamUsers = [spiritCaptain, teamCaptain, clubBoard];
    const gameId = req.params.id;

    const userRoleId = req.user.organisation
      ? req.user.organisation.roleId
      : req.user.roleId;

    const gameToScore = await Game.findByPk(gameId);
    console.log("gameToScore", gameToScore.dataValues);

    const { RKUScore, FNBScore, FMScore, PASCScore, COMMScore } = req.body;
    const spiritTotal = RKUScore + FNBScore + FMScore + PASCScore + COMMScore;

    if (admins.includes(userRoleId)) {
      if (req.body.spiritScoreFor === "home") {
        if (gameToScore.homeTeamReceivedSpiritScoreId) {
          return return409(res);
        } else {
          return createSpiritScoreInDbAndSendResponse(
            res,
            spiritTotal,
            gameToScore.homeTeamId
          );
        }
      } else {
        if (gameToScore.awayTeamReceivedSpiritScoreId) {
          return return409(res);
        } else {
          return createSpiritScoreInDbAndSendResponse(
            res,
            spiritTotal,
            gameToScore.awayTeamId
          );
        }
      }
    } else if (teamUsers.includes(userRoleId)) {
      if (req.user.teamId === gameToScore.homeTeamId) {
        if (gameToScore.awayTeamReceivedSpiritScoreId) {
          return return409(res);
        } else {
          return createSpiritScoreInDbAndSendResponse(
            res,
            spiritTotal,
            gameToScore.awayTeamId
          );
        }
      } else if (req.user.teamId === gameToScore.awayTeamId) {
        if (gameToScore.homeTeamReceivedSpiritScoreId) {
          return return409(res);
        } else {
          return createSpiritScoreInDbAndSendResponse(
            res,
            spiritTotal,
            gameToScore.homeTeamId
          );
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

module.exports = router;
