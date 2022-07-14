const getAll = require("./getAll");

const getById = async (id) => {
  const data = await getAll();
  const products = data.find((el) => el.id === id);
  return products;
};

module.exports = getById;
