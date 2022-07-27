const express = require("express");
const { Comment } = require("../../models");

const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log(req.user);
  try {
    const comment = await Comment.create({ ...req.body });
    res.status(201).json(comment);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
});

module.exports = router;
