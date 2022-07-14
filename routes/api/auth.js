const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { nanoid } = require("nanoid");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const { User } = require("../../models");
const { BadRequest, Conflict, Unauthorized } = require("http-errors");
const { joiSigupSchema, joiLoginSchema } = require("../../models/user");
const { sendEmail } = require("../../helpers");
const router = express.Router();

dotenv.config();

const { SECRET_KEY, SITE_NAME } = process.env;

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = joiSigupSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict("User already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const avatarURL = gravatar.url(email);
    const verificationToken = Date.now();
    const newUser = await User.create({
      name,
      email,
      verificationToken,
      password: hashPassword,
      avatarURL,
    });
    const data = {
      to: email,
      subject: "Подтверждение email",
      html: `<a target="_blank" href="${SITE_NAME}/verify/${verificationToken}">Email confirmation</a>`,
    };

    await sendEmail(data);
    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = joiLoginSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized("Email not found");
    }
    if (!user.verify) {
      throw new Unauthorized("Email not verify");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw new Unauthorized("Password wrong");
    }
    const { _id, name, avatarURL } = user;
    console.log(avatarURL);
    const payload = {
      id: _id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await User.findByIdAndUpdate(_id, { token });
    res.json({
      token,
      user: {
        name,
        email,
        avatar: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
