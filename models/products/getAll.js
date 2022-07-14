const fs = require("fs/promises");
const productPath=require('./productPath')


const getAll = async () => {
  const data = await fs.readFile(productPath);
  const products = JSON.parse(data);
  return products;
};

module.exports = getAll;
