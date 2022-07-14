const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const dotenv = require("dotenv");
const { BadRequest, NotFound } = require("http-errors");
const { User } = require("../../models");
const { sendEmail } = require("../../helpers");
const router = express.Router();
const { authenticate, upload } = require("../../middlewares");

dotenv.config();

const { SITE_NAME } = process.env;

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.get("/logout", authenticate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send("Logout success");
});

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const { path: tempUpload, filename } = req.file;
      const [extension] = filename.split(".").reverse();
      // if (extension !== "jpg") {
      //   throw new BadRequest("Bad format");
      // }
      const newFileName = `${Date.now()}.${extension}`;
      const fileUpload = path.join(avatarsDir, newFileName);
      await fs.rename(tempUpload, fileUpload);
      const avatarURL = path.join("avatars", newFileName);
      await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
      res.json({ avatarURL });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/current", authenticate, async (req, res) => {
  const { email, name, avatarURL } = req.user;
  res.json({
    user: {
      name,
      email,
      avatar: avatarURL,
    },
  });
});

router.post("/verify", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequest("missing required field email");
    }
    const user = User.findOne({ email });
    if (!user) {
      throw new NotFound("User not found");
    }
    if (user.verify) {
      throw new BadRequest("Verification has already been passed");
    }
    const { verificationToken } = user;
    const data = {
      to: email,
      subject: "Подтверждение email",
      html: `<a target="_blank" href="${SITE_NAME}/verify/${verificationToken}">Email confirmation</a>`,
    };

    await sendEmail(data);
    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
});

router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new NotFound("User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
