const Product = require("../models/product.model")

async function addProduct(req, res) {
  const { productName, productPrice, productImage, productCategory } = req.body;

  if (!productName || !productPrice || !productImage || !Array.isArray(productCategory)) {
    return res.status(400).send("All product details required");
  }

  const newProduct = new product({
    productName: productName,
    produtPrice: productPrice,
    productImage: productImage,
    productCategory: productCategory,
  })

  newProduct.save()

  res.status(200).json({ message: "product added successfully" });


}

module.exports = { addproduct }