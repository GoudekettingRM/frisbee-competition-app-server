const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const { getOneCompetition } = require("../competition/queries");
const { createTeam, getOneTeam, getAllTeams } = require("./queries");
const {
  superAdmin
} = require("../helper-files/role-validations/endpointRoles");
const { return403, return404 } = require("../helper-files/returnStatusCodes");

const router = new Router();

router.post("/teams", auth, async (req, res, next) => {
  try {
    const { competitionId } = req.body;
    if (!req.user.organisationId && req.user.roleId !== superAdmin) {
      return return403(res);
    } else {
      const currentCompetition = await getOneCompetition(competitionId);

      if (!currentCompetition)
        return return404(res, "Competition for team creation not found");

      const team = await createTeam({
        ...req.body,
        organisationId: req.user.organisationId
      });
      team.setCompetitions([currentCompetition]);

      return res.json({ message: "Team created successfully", team });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/teams", async (req, res, next) => {
  try {
    const teams = await getAllTeams();
    if (!teams.length) return return404(res, "Teams not found");
    return res.json(teams);
  } catch (err) {
    next(err);
  }
});

router.get("/teams/:id", async (req, res, next) => {
  try {
    const team = await getOneTeam(req.params.id);
    if (!team) return return404(res, "Team not found");
    return res.json(team);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
