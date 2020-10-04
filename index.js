const express = require("express");
const mongoose = require("mongoose");
const ganres = require("./routes/genres");
const app = express();

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongo DB..."))
  .catch(() => console.log("Could not connected to mongo DB..."));

app.use(express.json());
app.use("/api/ganres", ganres);
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
