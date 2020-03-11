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
  req,
  res,
  spiritTotal,
  spiritForTeamId,
  homeOrAway
) {
  const spiritData = {
    ...req.body,
    spiritTotal,
    teamId: spiritForTeamId
  };

  const spiritReceiver =
    homeOrAway === "home"
      ? "homeTeamReceivedSpiritScoreId"
      : "awayTeamReceivedSpiritScoreId";
  const newSpiritScore = await SpiritScore.create(spiritData);
  await Game.update(
    {
      [spiritReceiver]: newSpiritScore.id
    },
    { where: { id: req.body.gameId } }
  );

  const updatedGame = await Game.findByPk(req.body.gameId, {
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

router.post("/spirit-scores", auth, async (req, res, next) => {
  try {
    console.log("req.body:", req.body);
    const admins = [federation, superAdmin];
    const teamUsers = [spiritCaptain, teamCaptain, clubBoard];
    const userRoleId = req.user.organisation
      ? req.user.organisation.roleId
      : req.user.roleId;

    const gameToScore = await Game.findByPk(req.body.gameId);

    const { RKUScore, FNBScore, FMScore, PASCScore, COMMScore } = req.body;
    const spiritTotal = RKUScore + FNBScore + FMScore + PASCScore + COMMScore;

    if (admins.includes(userRoleId)) {
      if (req.body.spiritScoreFor === "home") {
        if (gameToScore.homeTeamReceivedSpiritScoreId) {
          console.log("1");

          return return409(res);
        } else {
          console.log("2");
          return createSpiritScoreInDbAndSendResponse(
            req,
            res,
            spiritTotal,
            gameToScore.homeTeamId,
            "home"
          );
        }
      } else {
        if (gameToScore.awayTeamReceivedSpiritScoreId) {
          console.log("3");
          return return409(res);
        } else {
          console.log("4");
          return createSpiritScoreInDbAndSendResponse(
            req,
            res,
            spiritTotal,
            gameToScore.awayTeamId,
            "away"
          );
        }
      }
    } else if (teamUsers.includes(userRoleId)) {
      if (req.user.teamId === gameToScore.homeTeamId) {
        if (gameToScore.awayTeamReceivedSpiritScoreId) {
          console.log("5");
          return return409(res);
        } else {
          console.log("6");
          return createSpiritScoreInDbAndSendResponse(
            req,
            res,
            spiritTotal,
            gameToScore.awayTeamId
          );
        }
      } else if (req.user.teamId === gameToScore.awayTeamId) {
        if (gameToScore.homeTeamReceivedSpiritScoreId) {
          console.log("7");
          return return409(res);
        } else {
          console.log("8");
          return createSpiritScoreInDbAndSendResponse(
            req,
            res,
            spiritTotal,
            gameToScore.homeTeamId
          );
        }
      } else {
        console.log("9");
        return return403(res);
      }
    } else {
      console.log("10");
      return return403(res);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
