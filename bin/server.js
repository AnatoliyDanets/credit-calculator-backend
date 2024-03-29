const app = require("../index");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful`);
    });
  })
  .catch((err) => {
    console.log(`Server not run. Error: ${err.message}`);
    process.exit(1);
  });
