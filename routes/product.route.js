const express = require("express");
const routes = express.Router();
const { addProduct, products } = require("../controller/product.controller.js");
const upload = require("../middleware/uploads.middleware.js")

const dotenv = require("dotenv");
require("dotenv").config();

// Public route to add a product
routes.post("/addProduct", upload.single("productImage"), addProduct);
routes.get("/products", products);

module.exports = routes; 
