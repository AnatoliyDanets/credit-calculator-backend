const { uuid } = require("uuidv4");
const updateProduct=require('./updateProduct')
const getAll = require("./getAll");

const add = async (data) => {
  const newProduct = { ...data };
  const product = await getAll();
  product.push(newProduct);
  await updateProduct(product)
  return newProduct;
};

module.exports = add;
