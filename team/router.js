const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Team = require("./model");
const User = require("../user/model");
const Competition = require("../competition/model");
const { superAdmin } = require("../endpointRoles");
const { return403, return404 } = require("../returnStatusCodes");

const router = new Router();

router.post("/teams", auth, async (req, res, next) => {
  try {
    if (!req.user.organisationId && req.user.roleId !== superAdmin) {
      return return403(res);
    } else {
      const currentCompetition = await Competition.findByPk(
        req.body.competitionId
      );

      if (!currentCompetition) {
        return return404(res, "Competition for team creation not found");
      }

      const newTeamData = {
        ...req.body,
        organisationId: req.user.organisationId
      };
      const team = await Team.create(newTeamData);
      team.setCompetitions([currentCompetition]);

      res.json(team);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/teams", async (req, res, next) => {
  try {
    const teams = await Team.findAll();
    if (!teams.length) {
      return return404(res, "Teams not found");
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
      return return404(res, "Team not found");
    }
    res.json(team);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
