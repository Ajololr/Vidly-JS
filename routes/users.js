const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt)

  const result = await user.save();

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send({
    name: result.name,
    email: result.email
  });
});

module.exports = router;
