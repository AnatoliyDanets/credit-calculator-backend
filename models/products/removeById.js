const updateProduct = require("./updateProduct");
const getAll = require("./getAll");

const removeById = async (id) => {
  const product = await getAll();
  const removeProduct = product.filter((el) => el.id !== id);
  await updateProduct(removeProduct);
  return removeProduct;
};

module.exports = removeById;
