const config = require("config");

module.exports = function() {
  if(!config.get("jwtPrivateKey")) {
    throw new Error("Fatal: jwt key is not defined");
  }
}