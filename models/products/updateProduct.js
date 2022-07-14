const fs=require('fs/promises')
const path = require("path");
const productPath = path.join(__dirname, "products.json");


const updateProduct=async(product)=>{
  await fs.writeFile(productPath, JSON.stringify(product, null, 2));
}

module.exports=updateProduct