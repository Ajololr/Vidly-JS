require("express-async-errors");
Joi.objectId = require("joi-objectid")(Joi);
const Joi = require("joi");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");
const app = express();

if(!config.get("jwtPrivateKey")) {
  console.log("Fatal: jwt key is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongo DB..."))
  .catch(() => console.log("Could not connected to mongo DB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
