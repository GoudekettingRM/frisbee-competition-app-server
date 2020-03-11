const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Game = require("./model");
const Organisation = require("../organisation/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");
const Team = require("../team/model");
const SpiritScore = require("../spirit-score/model");
const { return403, return404 } = require("../returnStatusCodes");
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
          { model: Team, as: "homeTeam" },
          { model: Team, as: "awayTeam" },
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
            { model: Team, as: "homeTeam" },
            { model: Team, as: "awayTeam" },
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
        { model: Team, as: "homeTeam" },
        { model: Team, as: "awayTeam" },
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

router.patch("/games/:id", auth, auth, async (req, res, next) => {
  try {
    console.log("req.body:", req.body);
    const rolesAllowed = [
      spiritCaptain,
      teamCaptain,
      clubBoard,
      federation,
      superAdmin
    ];
    const gameId = req.params.id;

    const userRoleId = req.user.organisation
      ? req.user.organisation.roleId
      : req.user.roleId;

    if (rolesAllowed.includes(userRoleId)) {
      await Game.update(req.body, {
        where: { id: gameId }
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
      console.log("updated game:", updatedGame);
      return res.send(updatedGame);
    } else {
      return return403(res);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
