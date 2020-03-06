const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Competition = require("./model");
const CompetitionDay = require("../competition-day/model");
const Team = require("../team/model");
const { federation } = require("../endpointRoles");

const router = new Router();

router.post("/competitions", auth, async (req, res, next) => {
  try {
    const rolesAllowed = [federation];
    if (rolesAllowed.includes(req.user.organisation.roleId)) {
      const newCompetitionReference = await Competition.create(req.body);

      if (!req.body.competitionDayDates.length) {
        res.json({
          message: "Competition created. NB: No competition days were added.",
          newCompetition: newCompetitionReference
        });
      } else {
        const competitionDays = req.body.competitionDayDates;

        await Promise.all(
          competitionDays.map(
            async date =>
              await CompetitionDay.create({
                date,
                competitionId: newCompetitionReference.id
              })
          )
        );

        const newCompetition = await Competition.findByPk(
          newCompetitionReference.id,
          {
            include: [CompetitionDay]
          }
        );

        res.json({
          message: "New competition created successfully",
          newCompetition
        });
      }
    } else {
      res
        .status(403)
        .send({
          message: "This can only be done by a federation admin account."
        })
        .end();
    }
  } catch (error) {
    next(error);
  }
});

router.get("/competitions", async (req, res, next) => {
  try {
    const competitions = await Competition.findAll({
      include: [CompetitionDay, Team]
    });
    if (!competitions.length) {
      res
        .status(404)
        .send({ message: "No competitions found" })
        .end();
    } else {
      res.json(competitions);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
