const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Game = require("./model");
const Organisation = require("../organisation/model");
const Competition = require("../competition/model");
const Team = require("../team/model");
const { federation, superAdmin } = require("../endpointRoles");

const router = new Router();

router.post("/games", auth, async (req, res, next) => {
  try {
    if (req.user.roleId === superAdmin) {
      const newGame = await Game.create(req.body);
      return res.json(newGame);
    } else {
      if (!req.user.organisationId) {
        console.log("Post game request failed, no organisation ID");
        return res
          .status(403)
          .send({ message: "User not authorized to perform this action." })
          .end();
      }

      const userOrganisation = await Organisation.findByPk(
        req.user.organisationId,
        {
          include: [Competition]
        }
      );

      if (!userOrganisation) {
        console.log("Post game request failed, no organisation found");

        return res
          .status(404)
          .send({ message: "Linked organisation not found" })
          .end();
      }

      const competitionByUserOrganisation = userOrganisation.competitions.find(
        competition => competition.dataValues.id === req.body.competitionId
      );
      const rolesAllowed = [federation];
      if (
        rolesAllowed.includes(userOrganisation.roleId) &&
        competitionByUserOrganisation
      ) {
        const newGame = await Game.create(req.body);
        return res.json(newGame);
      } else {
        console.log(
          "Post game request failed, user role not in allowed roles or competition not by user's organisation:",
          userOrganisation.roleId,
          competitionByUserOrganisation
        );

        return res
          .status(403)
          .send({ message: "User not authorized to perform this action." })
          .end();
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
        { model: Team, as: "awayTeam" }
      ]
    });
    if (!game)
      return res
        .status(404)
        .send({ message: "Game not found" })
        .end();

    res.send(game);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
