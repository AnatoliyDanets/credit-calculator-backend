const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "temp");
const multerConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },

  limits: {
    fileSize: 5120,
  },
});

const upload = multer({ storage: multerConfig });

module.exports = upload;
