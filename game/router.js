const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Game = require("./model");
const Organisation = require("../organisation/model");
const {
  federation,
  clubBoard,
  teamCaptain,
  spiritCaptain,
  player
} = require("../endpointRoles");

const router = new Router();

router.post("/games", auth, async (req, res, next) => {
  try {
    if (!req.user.organisationId) {
      res
        .status(403)
        .send({ message: "User not authorized to perform this action." })
        .end();
    }
    const userOrganisation = await Organisation.findByPk(
      req.user.organisationId
    );
    if (!userOrganisation) {
      res
        .status(404)
        .send({ message: "Linked organisation not found" })
        .end();
    }
    const rolesAllowed = [federation];
    if (rolesAllowed.includes(userOrganisation.roleId)) {
      //This assumes that the request contains the competitionDayId and the competition id.
      const newGame = Game.create(req.body);
      res.json(newGame);
    } else {
      res
        .status(403)
        .send({ message: "User not authorized to perform this action." })
        .end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
