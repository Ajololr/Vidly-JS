const Joi = require("joi");
const mogoose = require("mongoose");

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

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
