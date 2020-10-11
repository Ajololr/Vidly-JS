const { format } = require("winston");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function() {
  process.on("unhandledRejection", (ex) => {
    throw ex;
  })

  winston.add(new winston.transports.File({ filename: "logs/error.log", level: "error" }));
  winston.add(new winston.transports.File({ filename: "logs/combined.log" }))

  if (process.env.NODE_ENV !== 'production') {
    winston.add(new winston.transports.Console({
      format: format.combine(format.colorize(), format.simple())
    }));
  }
}