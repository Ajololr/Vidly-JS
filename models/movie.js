const Joi = require("joi");
const mogoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mogoose.model(
  "Movie",
  new mogoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
      trim: true,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
    dailyRentailRate: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
  })
);

function validateMovie(genre) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required().default(0).max(100),
    dailyRentailRate: Joi.number().required().default(0).max(100),
  });

  const res = schema.validate(genre);

  return res;
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
