const User = require("../user/model");
const Organisation = require("../organisation/model");
const Team = require("../team/model");
const { toData } = require("./jwt");
const {
  return400,
  return401,
  return403
} = require("../helper-files/returnStatusCodes");

function blockEndpoint(req, res, next) {
  return return403(res);
}

function auth(req, res, next) {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);

      User.findByPk(data.userId, { include: [Organisation, Team] })
        .then(user => {
          if (!user) {
            return return401(res);
          }
          req.user = user;
          next();
        })
        .catch(next);
    } catch (error) {
      return return400(res, `${error.name}: ${error.message}`);
    }
  } else {
    return return401(res);
  }
}
module.exports = { auth, blockEndpoint };
