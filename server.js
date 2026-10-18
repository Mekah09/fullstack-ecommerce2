const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route")
const connectDB = require("./config/db")
dotenv.config();
const PORT = process.env.PORT;
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json())
app.use("/user", userRoutes)
app.use("/", productRoutes)

app.use((error, req, res, next) => {
    console.dir(error, { depth: null });

    res.status(500).json({
        message: "Request failed. Check the server terminal.",
    });
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})