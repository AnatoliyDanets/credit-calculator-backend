const app = require("../app");
const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const {DB_HOST}=process.env
const PORT = process.env.PORT || 3001;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful`);
    });
  })
  .catch(err => {
    console.log(`Server not run. Error: ${err.message}`);
    process.exit(1);
  });