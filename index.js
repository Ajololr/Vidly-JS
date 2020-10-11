const express = require("express");
const winston = require("winston");
const config = require("config");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

// throw new Error("Unhandled error.")

const p = Promise.reject(new Error("Unhandled promice rejection."))
p.then(()=> console.log("asd"));

const PORT = config.get("PORT");
app.listen(PORT, () => winston.info(`Listening on port ${PORT}...`));
