const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Game = require("./model");
const Organisation = require("../organisation/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");
const Team = require("../team/model");
const User = require("../user/model");
const SpiritScore = require("../spirit-score/model");
const { return400, return403, return404 } = require("../returnStatusCodes");
const {
  spiritCaptain,
  teamCaptain,
  clubBoard,
  federation,
  superAdmin
} = require("../endpointRoles");

const router = new Router();

router.post("/games", auth, async (req, res, next) => {
  try {
    if (req.user.roleId === superAdmin) {
      const createdGame = await Game.create(req.body);
      const newGame = await Game.findByPk(createdGame.id, {
        include: [
          Competition,
          { model: Team, as: "homeTeam", include: [User] },
          { model: Team, as: "awayTeam", include: [User] },
          CompetitionDay,
          { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
          { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
        ]
      });
      return res.json(newGame);
    } else {
      if (!req.user.organisationId) {
        return return403(res);
      }

      const userOrganisation = await Organisation.findByPk(
        req.user.organisationId,
        {
          include: [Competition]
        }
      );

      if (!userOrganisation) {
        return return404(res, "Linked organisation not found");
      }

      const competitionByUserOrganisation = userOrganisation.competitions.find(
        competition => competition.dataValues.id === req.body.competitionId
      );
      const rolesAllowed = [federation];
      if (
        rolesAllowed.includes(userOrganisation.roleId) &&
        competitionByUserOrganisation
      ) {
        const createdGame = await Game.create(req.body);
        const newGame = await Game.findByPk(createdGame.id, {
          include: [
            Competition,
            { model: Team, as: "homeTeam", include: [User] },
            { model: Team, as: "awayTeam", include: [User] },
            CompetitionDay,
            { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
            { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
          ]
        });
        return res.json(newGame);
      } else {
        return return403(res);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.get("/games/:id", async (req, res, next) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findByPk(gameId, {
      include: [
        Competition,
        { model: Team, as: "homeTeam", include: [User] },
        { model: Team, as: "awayTeam", include: [User] },
        CompetitionDay,
        { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
        { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
      ]
    });
    if (!game) return return404(res, "Game not found");

    res.send(game);
  } catch (error) {
    next(error);
  }
});

router.patch("/games/:id", auth, async (req, res, next) => {
  try {
    const admins = [federation, superAdmin];
    const teamUsers = [spiritCaptain, teamCaptain, clubBoard];
    const gameId = req.params.id;
    const userRoleId = req.user.organisation
      ? req.user.organisation.roleId
      : req.user.roleId;

    const gameToUpdate = await Game.findByPk(gameId, {
      include: [
        { model: Team, as: "homeTeam" },
        { model: Team, as: "awayTeam" }
      ]
    });

    if (req.headers.scoring) {
      if (!req.body.homeTeamScore || !req.body.awayTeamScore) {
        return return400(
          res,
          "Scoring a game needs a home team score and an away team score."
        );
      } else {
        const { homeTeam, awayTeam } = gameToUpdate;
        const teamByUserOrganisation =
          userRoleId === clubBoard
            ? homeTeam.organisationId === req.user.organisationId ||
              awayTeam.organisationId === req.user.organisationId
              ? true
              : false
            : false;

        if (
          admins.includes(userRoleId) ||
          (teamUsers.includes(userRoleId) &&
            (req.user.teamId === gameToUpdate.homeTeamId ||
              req.user.teamId === gameToUpdate.awayTeamId ||
              teamByUserOrganisation))
        ) {
          await Game.update(
            {
              homeTeamScore: req.body.homeTeamScore,
              awayTeamScore: req.body.awayTeamScore
            },
            { where: { id: gameId } }
          );
        }
        const updatedGame = await Game.findByPk(gameId, {
          include: [
            Competition,
            { model: Team, as: "homeTeam", include: [User] },
            { model: Team, as: "awayTeam", include: [User] },
            CompetitionDay,
            { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
            { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
          ]
        });
        return res.send(updatedGame);
      }
    } else if (admins.includes(userRoleId)) {
      await Game.update(req.body, {
        where: { id: gameId }
      });
      const updatedGame = await Game.findByPk(gameId, {
        include: [
          Competition,
          { model: Team, as: "homeTeam", include: [User] },
          { model: Team, as: "awayTeam", include: [User] },
          CompetitionDay,
          { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
          { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
        ]
      });
      return res.send(updatedGame);
    } else {
      return return403(res);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
