const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Team = require("./model");
const User = require("../user/model");
const {
  federation,
  clubBoard,
  teamCaptain,
  spiritCaptain,
  player
} = require("../endpointRoles");

const router = new Router();

router.post("/teams", auth, async (req, res, next) => {
  try {
    const rolesAllowed = [federation, clubBoard];
    if (rolesAllowed.includes(req.user.roleId)) {
      const team = await Team.create(req.body);
      res.json(team);
    } else {
      res
        .status(403)
        .send({ message: "You are not allowed to perform this action" })
        .end();
    }
  } catch (err) {
    next(err);
  }
});

router.get("/teams", async (req, res, next) => {
  try {
    const teams = await Team.findAll();
    if (!teams.length) {
      res
        .status(404)
        .send({ message: "No teams found" })
        .end();
    } else {
      res.json(teams);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/teams/:id", async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const team = await Team.findByPk(teamId, {
      include: [{ model: User, attributes: ["firstName", "lastName"] }]
    });
    if (!team) {
      res
        .status(404)
        .send({ message: "Team not found" })
        .end();
    }
    res.json(team);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
