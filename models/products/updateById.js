const updateProduct = require("./updateProduct");
const getAll = require("./getAll");

const updateById = async ({ id, ...data }) => {
  const product = await getAll();
  const idx = product.findIndex((el) => el.id === id);
  product[idx]={ id, ...data }
  await updateProduct(product)
  return product[idx]
};

module.exports = updateById;
