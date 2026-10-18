const Product = require("../models/product.model")
const upload = require("../middleware/uploads.middleware")
const cloudinary = require("../config/cloudStorage")

async function addProduct(req, res) {
  const { productName, productPrice, productCategory } = req.body;

  if (!productName || !productPrice || !Array.isArray(productCategory)) {
    return res.status(400).send("All product details required");
  }
  if (!req.file) {
    return res.status(400).send("Product image is required");
  }

  const base64 = req.file.buffer.toString("base64");
  const dataUri = `data:${req.file.mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "my-app/uploads", // organises files inside your Cloudinary account
  });

  const newProduct = new product({
    productName: productName,
    produtPrice: productPrice,
    productImage: result.secure_url,
    productCategory: productCategory,
  })

  newProduct.save()

  res.status(200).json({ message: "product added successfully" });
}

async function products(req, res) {
  const products = await Products.find()
  res.status(200).json({ message: "product fetched successfully", products });
}

module.exports = { addProduct, products }