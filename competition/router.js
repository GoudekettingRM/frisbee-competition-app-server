const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Competition = require("./model");
const CompetitionDay = require("../competition-day/model");
const Team = require("../team/model");
const Game = require("../game/model");
const { federation, superAdmin } = require("../endpointRoles");

const router = new Router();

router.post("/competitions", auth, async (req, res, next) => {
  try {
    const rolesAllowed = [federation, superAdmin];
    if (rolesAllowed.includes(req.user.organisation.roleId)) {
      const newCompetitionReference = await Competition.create(req.body);

      if (!req.body.competitionDayDates.length) {
        return res.json({
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
            include: [
              CompetitionDay,
              { model: Team, include: [Competition] },
              Game
            ]
          }
        );

        return res.json({
          message: "New competition created successfully",
          newCompetition
        });
      }
    } else {
      return res
        .status(403)
        .send({
          message: "This can only be done by a federation / admin account."
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
      include: [
        CompetitionDay,
        { model: Team, include: [Competition] },
        {
          model: Game,
          include: [
            { model: Team, as: "homeTeam" },
            { model: Team, as: "awayTeam" }
          ]
        }
      ]
    });
    if (!competitions.length) {
      return res
        .status(404)
        .send({ message: "No competitions found" })
        .end();
    } else {
      return res.json(competitions);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/competitions/:id", async (req, res, next) => {
  try {
    const competition = await Competition.findByPk(req.params.id, {
      include: [
        CompetitionDay,
        { model: Team, include: [Competition] },
        {
          model: Game,
          include: [
            { model: Team, as: "homeTeam" },
            { model: Team, as: "awayTeam" }
          ]
        }
      ]
    });
    if (!competition) {
      return res
        .status(404)
        .send({ message: "Competition not found" })
        .end();
    } else {
      return res.json(competition);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
