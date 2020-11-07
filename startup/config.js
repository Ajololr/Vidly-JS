const config = require("config");

module.exports = function () {
  console.log("JWT:", config.get("jwtPrivateKey"));
  if (!config.get("jwtPrivateKey")) {
    throw new Error("Fatal: jwt key is not defined");
  }
};
