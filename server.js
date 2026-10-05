const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json())


connectDB();

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
} )