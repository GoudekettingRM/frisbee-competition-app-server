const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const { createGame, getGame, updateGame } = require("./queries");
const { getOneOrganisation } = require("../organisation/queries");
const {
  return400,
  return403,
  return404
} = require("../helper-files/returnStatusCodes");
const {
  getUserRole
} = require("../helper-files/role-validations/rbac-helpers");
const {
  spiritCaptain,
  teamCaptain,
  clubBoard,
  federation,
  superAdmin
} = require("../helper-files/role-validations/endpointRoles");

const router = new Router();

router.post("/games", auth, async (req, res, next) => {
  try {
    if (req.user.roleId === superAdmin) {
      const createdGame = await createGame(req.body);
      const newGame = await getGame(createdGame.id);
      return res.json({ message: "New game created successfully", newGame });
    } else {
      if (!req.user.organisationId) {
        return return403(res);
      }

      const userOrganisation = await getOneOrganisation(
        req.user.organisationId
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
        const createdGame = await createGame(req.body);
        const newGame = await getGame(createdGame.id);

        return res.json({ message: "New game created successfully", newGame });
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
    const game = await getGame(req.params.id);

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
    const userRoleId = getUserRole(req.user);

    const gameToUpdate = await getGame(gameId);

    if (req.headers.scoring) {
      if (!req.body.homeTeamScore || !req.body.awayTeamScore) {
        return return400(
          res,
          "Scoring a game needs a home team score and an away team score."
        );
      } else {
        const { homeTeam, awayTeam } = gameToUpdate;
        const teamByUserOrganisation =
          userRoleId === clubBoard &&
          (homeTeam.organisationId === req.user.organisationId ||
            awayTeam.organisationId === req.user.organisationId);

        if (
          admins.includes(userRoleId) ||
          (teamUsers.includes(userRoleId) &&
            (req.user.teamId === gameToUpdate.homeTeamId ||
              req.user.teamId === gameToUpdate.awayTeamId ||
              teamByUserOrganisation))
        ) {
          const gameUpdateData = {
            homeTeamScore: req.body.homeTeamScore,
            awayTeamScore: req.body.awayTeamScore
          };
          await updateGame(gameUpdateData, gameId);
        }
        const updatedGame = await getGame(gameId);

        return res.send({ message: "Game updated successfully", updatedGame });
      }
    } else if (admins.includes(userRoleId)) {
      await updateGame(req.body, gameId);

      const updatedGame = await getGame(gameId);

      return res.send({ message: "Game updated successfully", updatedGame });
    } else {
      return return403(res);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
