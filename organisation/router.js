const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const { createOrganisation, updateOrganisation } = require("./queries");
const { return400 } = require("../helper-files/returnStatusCodes");
const { updateUser } = require("../user/queries");

const router = new Router();

router.post("/organisations", auth, async (req, res, next) => {
  try {
    if (req.user.organisationId) {
      return return400(res, "User already contact for one organisation");
    }
    const tempOrganisation = await createOrganisation(req.body);

    await updateUser({ organisationId: tempOrganisation.id }, req.user.id);

    const newOrganisation = await getOneOrganisation(tempOrganisation.id);
    return res.json({
      message:
        "New organisation created successfully. You has been registered as contact for organisation.",
      newOrganisation
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/organisations", auth, async (req, res, next) => {
  try {
    await updateOrganisation(req.body, req.user.organisation.id);
    const updatedOrganisation = await getOneOrganisation(
      req.user.organisation.id
    );

    return res.json({
      message: "Organisation updated successfully",
      updatedOrganisation
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
