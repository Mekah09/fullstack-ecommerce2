const express = require("express");
const routes = express.Router();
const { signUp, signIn, verifyOTP, allUsers } = require("../controller/auth.controller.js");
const { protect, allowRoles } = require("../middleware/auth.middleware.js")

//public routes
routes.post("/signup", signUp);
routes.post("/signin", signIn);
routes.post("/verifyOTP", verifyOTP); //For verifying the OTP during the sign-up process
routes.get("/allusers", allUsers); //For fetching all users admin route

// Admin-only route
routes.get("/allusers", protect, allowRoles("admin"), allUsers);

module.exports = routes; 