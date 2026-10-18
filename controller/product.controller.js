const Product = require("../models/product.model");

async function addProduct(req, res) {
  try {
    const { productName, productPrice, productCategory } = req.body;

    if (!productName || !productPrice || !productCategory) {
      return res.status(400).json({
        message: "All product details required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const newProduct = new Product({
      productName,
      productPrice,
      productCategory,
      productImage: req.file.path,
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
  }
}

async function products(req, res) {
  try {
    const allProducts = await Product.find();

    return res.status(200).json({
      message: "Products fetched successfully",
      products: allProducts,
    });
  } catch (error) {
    console.error(error)
  }
}

module.exports = { addProduct, products };