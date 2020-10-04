const express = require("express");
const Joi = require("joi");
const mogoose = require("mongoose");
const router = express.Router();

const Ganre = mogoose.model(
  "Ganre",
  new mogoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

function validateGanre(ganre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const res = schema.validate(ganre);

  return res;
}

router.get("/", async (req, res) => {
  const ganres = await Ganre.find();
  res.send(ganres);
});

router.get("/:id", async (req, res) => {
  const ganre = await Ganre.findById(req.params.id);

  if (!ganre) return res.status(404).send("No ganre with the given id");

  res.send(ganre);
});

router.post("/", async (req, res) => {
  const { error } = validateGanre(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const ganre = new Ganre({
    name: req.body.name,
  });
  const result = await ganre.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGanre(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const ganre = await Ganre.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.send(ganre);
  } catch (ex) {
    return res.status(404).send("No ganre with the given id");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ganre = await Ganre.findByIdAndDelete(req.params.id);
    res.send(ganre);
  } catch (ex) {
    return res.status(404).send("No ganre with the given id");
  }
});

module.exports = router;
