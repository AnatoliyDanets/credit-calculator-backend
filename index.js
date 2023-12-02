// const productsOperations = require("./products");
// console.log(productsOperations);
// const invokenProducts = async ({ action, id, name }) => {
//   switch (action) {
//     case "getAll":
//       const products = await productsOperations.getAll();
//       console.log(products);
//       break;
//     case "getById":
//       const productId = await productsOperations.getById(id);
//       console.log(productId);
//       break;
//     case "add":
//       const newProduct = await productsOperations.add({ name });
//       console.log(newProduct);
//       break;
//     case "updateById":
//       const updateProduct = await productsOperations.updateById({ id, name });
//       console.log(updateProduct);
//       break;
//     case "removeById":
//       const removeProduct = await productsOperations.removeById(id);
//       console.log(removeProduct);
//       break;
//     default:
//       break;
//   }
// };
// const id = "1";
// const data = {
//   name: "iphone 6",
// };

// const updateData = {
//   name: "Google Pixel 6",
// };
// invokenProducts({action:"getById",id});
// invokenProducts({ action: "add", ...data });
// invokenProducts({ action: "updateById", ...updateData, id});
// invokenProducts({ action: "removeById", id });

// mongoDb base banking- password:mongodb3108 login:owsdoc

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const authRouters = require("./routes/api/auth");
const usersRouter = require("./routes/api/users");
const banksRouters = require("./routes/api/banks");
const commentsRouter=require("./routes/api/comments")
const appServer = express();
const formatsLogger = appServer.get("env") === "development" ? "dev" : "short";

appServer.use(logger(formatsLogger));
appServer.use(cors());
appServer.use(express.json());
appServer.use(express.static("public"))
appServer.use("/api/auth", authRouters);
appServer.use("/api/users", usersRouter);
appServer.use("/api/banks", banksRouters);
appServer.use("/api/comments", commentsRouter)
appServer.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

appServer.use((err, req, res, next) => {
  const { status = 500, message = "Server Error" } = err;
  res.status(status).json({ message });
});

module.exports = appServer;
