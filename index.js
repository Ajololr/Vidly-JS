const express = require("express");
const Joi = require("joi");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const ganres = [
  {
    id: 1,
    name: "action",
  },
  {
    id: 2,
    name: "romantic",
  },
  {
    id: 3,
    name: "comedy",
  },
  {
    id: 4,
    name: "drama",
  },
  {
    id: 5,
    name: "fantasy",
  },
];

function validateGanre(ganre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const res = schema.validate(ganre);

  return res;
}

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/api/ganres", (req, res) => {
  res.send(ganres);
});

app.get("/api/ganres/:id", (req, res) => {
  const ganre = ganres.find((item) => item.id === parseInt(req.params.id));

  if (!ganre) {
    res.status(404).send("No ganre with the given id");
    return;
  }
  res.send(ganre);
});

app.post("/api/ganres/", (req, res) => {
  const { error } = validateGanre(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const ganre = {
    id: ganres.length + 1,
    name: req.body.name,
  };
  ganres.push(ganre);
  res.send(ganre);
});

app.put("/api/ganres/:id", (req, res) => {
  const ganre = ganres.find((item) => item.id === parseInt(req.params.id));

  if (!ganre) {
    res.status(404).send("No ganre with the given id");
    return;
  }

  const { error } = validateGanre(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  ganre.name = req.body.name;
  res.send(ganre);
});

app.delete("/api/ganres/:id", (req, res) => {
  const ganre = ganres.find((item) => item.id === parseInt(req.params.id));

  if (!ganre) {
    res.status(404).send("No ganre with the given id");
    return;
  }

  const index = ganres.indexOf(ganre);
  ganres.splice(index, 1);

  res.send(ganre);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
