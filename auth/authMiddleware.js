const { toData } = require("./jwt");
const { return400, return401 } = require("../helper-files/returnStatusCodes");
const { getSpecificUser } = require("../user/queries");

const auth = async (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);

      const user = await getSpecificUser(data.userId);

      if (!user) {
        return return401(res);
      }

      req.user = user;

      next();
    } catch (error) {
      return return400(res, `${error.name}: ${error.message}`);
    }
  } else {
    return return401(res);
  }
};
module.exports = { auth };
