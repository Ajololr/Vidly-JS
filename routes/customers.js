const express = require("express");
const Joi = require("joi");
const mogoose = require("mongoose");
const router = express.Router();

const Customer = mogoose.model(
  "Customer",
  new mogoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 30,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 20,
    },
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(30).required(),
    isGold: Joi.bool().default(false),
    phone: Joi.string().min(5).max(20).required(),
  });

  const result = schema.validate(customer);

  return result;
}

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send("No customer with the given id");

  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  const result = await customer.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.send(customer);
  } catch (ex) {
    return res.status(404).send("No customer with the given id");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    res.send(customer);
  } catch (ex) {
    return res.status(404).send("No customer with the given id");
  }
});

module.exports = router;
