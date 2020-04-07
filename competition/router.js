const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const { return403, return404 } = require("../helper-files/returnStatusCodes");
const {
  getAllCompetitions,
  getOneCompetition,
  createCompetition
} = require("./queries");
const { createCompetitionDay } = require("../competition-day/queries");
const {
  federation,
  superAdmin
} = require("../helper-files/role-validations/endpointRoles");

const router = new Router();

router.post("/competitions", auth, async (req, res, next) => {
  try {
    const rolesAllowed = [federation, superAdmin];
    if (rolesAllowed.includes(req.user.organisation.roleId)) {
      if (!req.body.competitionDayDates.length) {
        return return400(
          res,
          "You need to add competition days if you want to create a competition."
        );
      } else {
        const tempCompetition = await createCompetition(req.body);
        const competitionDays = req.body.competitionDayDates;

        await Promise.all(
          competitionDays.map(date =>
            createCompetitionDay(date, tempCompetition.id)
          )
        );

        const newCompetition = await getOneCompetition(tempCompetition.id);

        return res.json({
          message: "New competition created successfully",
          newCompetition
        });
      }
    } else {
      return return403(res);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/competitions", async (req, res, next) => {
  try {
    const competitions = await getAllCompetitions();

    if (!competitions.length) {
      return return404(res, "No competition found");
    } else {
      return res.json(competitions);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/competitions/:id", async (req, res, next) => {
  try {
    const competition = await getOneCompetition(req.params.id);

    if (!competition) {
      return return404(res, "Competition not found");
    } else {
      return res.json(competition);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
