const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");

const router = new Router();

router.post("/games/:id", auth, async (req, res, next) => {
  try {
    console.log("Hi from games router!");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
