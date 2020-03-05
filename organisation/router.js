const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Organisation = require("./model");
const User = require("../user/model");

const router = new Router();

router.post("/organisations", auth, async (req, res, next) => {
  try {
    if (req.user.organisationId) {
      res
        .status(400)
        .send({
          message: `New organisation not created. User already is the contact for another organisation.`
        })
        .end();
    }
    const newOrganisation = await Organisation.create(req.body);
    const updatedUser = await User.update(
      { organisationId: newOrganisation.id },
      { where: { id: req.user.id } }
    );
    res.json({
      message:
        "New organisation created successfully. User has been registered as contact for organisation.",
      newOrganisation,
      updatedUser
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/organisations", auth, async (req, res, next) => {
  try {
    console.log("req.user in organisations patch", req.user.organisation.id);
    await Organisation.update(req.body, {
      where: {
        id: req.user.organisation.id
      }
    });
    const updatedOrganisation = await Organisation.findByPk(
      req.user.organisation.id
    );
    console.log("updatedOrganisation test", updatedOrganisation);
    res.json(updatedOrganisation);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
