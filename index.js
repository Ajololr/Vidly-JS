const express = require("express");
const winston = require("winston");
const config = require("config");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const PORT = config.get("PORT");
app.listen(PORT, () => winston.info(`Listening on port ${PORT}...`));
