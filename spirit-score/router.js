const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const SpiritScore = require("../spirit-score/model");
const Game = require("../game/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");
const Team = require("../team/model");
const User = require("../user/model");
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
      { model: Team, as: "homeTeam", include: [User] },
      { model: Team, as: "awayTeam", include: [User] },
      CompetitionDay,
      { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
      { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
    ]
  });

  res.json(updatedGame);
}
async function updateSpiritInDbAndSendResponse(
  res,
  updatedSpiritData,
  spiritScoreId,
  gameId
) {
  await SpiritScore.update(updatedSpiritData, {
    where: { id: spiritScoreId }
  });
  const gameWithUpdatedSpirit = await Game.findByPk(gameId, {
    include: [
      Competition,
      { model: Team, as: "homeTeam", include: [User] },
      { model: Team, as: "awayTeam", include: [User] },
      CompetitionDay,
      { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
      { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
    ]
  });
  return res.json(gameWithUpdatedSpirit);
}
function allowedToEditSpiritScore(spiritScoreFor, user, game, userRoleId) {
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
}

const router = new Router();

router.post("/spirit-scores", auth, async (req, res, next) => {
  try {
    // console.log("req.body from spirit scores POST:", req.body);
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
          return return409(res);
        } else {
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
          return return409(res);
        } else {
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
          return return409(res);
        } else {
          return createSpiritScoreInDbAndSendResponse(
            req,
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
            req,
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

router.patch("/spirit-scores/:id", auth, async (req, res, next) => {
  try {
    console.log("Req.body from spirit-score PATCH", req.body);
    const admins = [federation, superAdmin];
    const teamUsers = [spiritCaptain, teamCaptain, clubBoard];
    const spiritScoreId = req.params.id;
    const userRoleId = req.user.organisation
      ? req.user.organisation.roleId
      : req.user.roleId;

    const { RKUScore, FNBScore, FMScore, PASCScore, COMMScore } = req.body;
    const spiritTotal = RKUScore + FNBScore + FMScore + PASCScore + COMMScore;

    const updatedSpiritData = {
      ...req.body,
      spiritTotal
    };

    if (admins.includes(userRoleId)) {
      updateSpiritInDbAndSendResponse(
        res,
        updatedSpiritData,
        spiritScoreId,
        req.body.gameId
      );
    } else if (teamUsers.includes(userRoleId)) {
      console.log("Need to check if user is okay");
      const game = await Game.findByPk(req.body.gameId, {
        include: [
          { model: Team, as: "homeTeam" },
          { model: Team, as: "awayTeam" }
        ]
      });
      if (
        allowedToEditSpiritScore(
          req.body.spiritScoreFor,
          req.user,
          game,
          userRoleId
        )
      ) {
        updateSpiritInDbAndSendResponse(
          res,
          updatedSpiritData,
          spiritScoreId,
          req.body.gameId
        );
      } else return return403(res);
    } else return return403(res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
