const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const dbUrl = config.get("db");
  console.log("DB url:", dbUrl);
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info(`Connected to ${dbUrl}...`));
};
