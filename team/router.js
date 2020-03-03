const { Router } = require("express");
const Team = require("./model");
const Player = require("../player/model");

const router = new Router();

router.post("/teams", async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.json(team);
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
      include: [{ model: Player, attributes: ["firstName", "lastName"] }]
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
