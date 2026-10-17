const mongoose = require("mongoose")


const AuthSchema = new mongoose.Schema({
    name: {
        type: String
    },

    email: {
        type: String
    },

    password: {
        type: String
    },

    otp: {
        type: Number,
        unique: true,
    },

    verified: {
        type: Boolean,
        default: false,
    },

    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
})

const Auth = mongoose.model("Auth", AuthSchema);
module.exports = Auth;