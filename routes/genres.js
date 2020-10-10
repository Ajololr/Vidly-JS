const { Genre, validateGenre } = require("../models/genre");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const ganre = await Genre.findById(req.params.id);

  if (!ganre) return res.status(404).send("No genre with the given id");

  res.send(ganre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const genre = new Genre({
    name: req.body.name,
  });
  const result = await genre.save();

  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.send(genre);
  } catch (ex) {
    return res.status(404).send("No genre with the given id");
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    res.send(genre);
  } catch (ex) {
    return res.status(404).send("No genre with the given id");
  }
});

module.exports = router;
