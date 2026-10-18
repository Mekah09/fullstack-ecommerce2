const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true
    },
    productPrice: {
        type: Number,
        require: true
    },
    productImage: {
        type: String,
         require: true
    },
    productCategory:{
        type: String,
    }

})

const product = mongoose.model("Product", productSchema);
module.exports = product