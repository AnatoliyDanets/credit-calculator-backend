const { Schema, model } = require("mongoose");
const Joi = require("joi");

const bankSchema = Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 60,
      required: true,
    },
    date: { type: Number, required: true },
    createDate: { type: String, required: true },
    category: {
      type: Number,
      min: 5,
      max: 30,
      required: true,
    },
    max: {
      type: Number,
      min: 10000,
      max: 1000000000,
      required: true,
    },
    min: {
      type: Number,
      min: 5,
      max:50,
      required: true,
    },
    credit: {
      type: Number,
      min: 3,
      max: 48,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
  },
  { versionKey: false, timestamps: true }
);

const Bank = model("bank", bankSchema);
const joiSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  date: Joi.number().required(),
  createDate: Joi.string(),
  category: Joi.number().integer().min(5).max(30).required(),
  max: Joi.number().integer().min(10000).max(1000000000),
  min: Joi.number().integer().min(5).max(50).required(),
  credit: Joi.number().integer().min(3).max(48).required(),
});
module.exports = { Bank, joiSchema };
