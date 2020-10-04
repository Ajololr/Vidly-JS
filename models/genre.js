const Joi = require("joi");
const mogoose = require("mongoose");

const Genre = mogoose.model(
  "Genre",
  new mogoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const res = schema.validate(genre);

  return res;
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
