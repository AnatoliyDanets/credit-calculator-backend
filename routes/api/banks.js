const express = require("express");
const { Bank, joiSchema } = require("../../models");
const { NotFound, BadRequest } = require("http-errors");
const { authenticate } = require("../../middlewares");
// const products = require("../../products.json");
// const productsOperations = require("../../models/products");
const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const { _id } = req.user;
    const banks = await Bank.find({ owner: _id }, "-colors", {
      skip,
      limit: +limit,
    });
    res.json(banks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const bank = await Bank.findById(id);
    if (!bank) {
      throw new NotFound();
    }
    res.json(bank);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  console.log(req.user);
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { _id } = req.user;
    const newBank = await Bank.create({ ...req.body, owner: _id });
    res.status(201).json(newBank);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateBank = await Bank.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateBank) {
      throw new NotFound();
    }
    res.json(updateBank);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateBank = await Bank.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateBank) {
      throw new NotFound();
    }
    res.json(updateBank);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const removeBank = await Bank.findByIdAndRemove(id);
    if (!removeBank) {
      throw new NotFound();
    }
    res.json({ message: "bank delete" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
