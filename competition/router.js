const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Competition = require("./model");
const CompetitionDay = require("../competition-day/model");
const {
  federation,
  clubBoard,
  teamCaptain,
  spiritCaptain,
  player
} = require("../endpointRoles");

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

module.exports = router;
