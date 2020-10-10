const { Movie, validateMovie } = require("../models/movie");
const express = require("express");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Movie.find();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const ganre = await Movie.findById(req.params.id);

  if (!ganre) return res.status(404).send("No movie with the given id");

  res.send(ganre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send(error.message);

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentailRate: req.body.dailyRentailRate,
  });
  const result = await movie.save();

  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send(error.message);

  try {
    const genre = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentailRate: req.body.dailyRentailRate,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.send(genre);
  } catch (ex) {
    return res.status(404).send("No movie with the given id");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const genre = await Movie.findByIdAndDelete(req.params.id);
    res.send(genre);
  } catch (ex) {
    return res.status(404).send("No movie with the given id");
  }
});

module.exports = router;
