const Player = require("../player/model");
const { toData } = require("./jwt");

function blockEndpoint(req, res, next) {
  res
    .status(403)
    .send({ message: "Endpoint blocked" })
    .end();
}

function auth(req, res, next) {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);

      Player.findByPk(data.playerId)
        .then(player => {
          if (!player) {
            res
              .status(401)
              .send({ message: "Please supply valid credentials" })
              .end();
          }
          req.player = player;
          next();
        })
        .catch(next);
    } catch (error) {
      res.status(400).send({
        message: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
}
module.exports = { auth, blockEndpoint };
