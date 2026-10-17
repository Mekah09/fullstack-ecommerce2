const Auth = require("../models/Auth.model.js");
const bcrypt = require("bcryptjs")
const sendEmail = require("../service/mail.js");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("All details required");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 9000);

    const newUser = new Auth({
      name: name,
      email: email,
      password: hashPassword,
      otp: otp,
      role: "user",
      verified: false,
    })

    newUser.save();

    sendEmail({
      to: email,
      subject: "New account",
      text: `Hello ${name}, Welcome to our platform verify your OTP ${otp}`,
      html: `<h3>Hello ${name}</h3> <p>Welcome to our platform verify your OTP ${otp}</p>`
    })
    res.status(201).json({ message: "Sign up sucessfully" })

  } catch (error) {
    console.error(error)
  }
};

async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const authUser = await Auth.findOne({ email })
      .select("+password");

    if (!authUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      authUser.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!authUser.verified || !authUser.isActive) {
      return res.status(403).json({
        message: "Account is unverified or disabled",
      });
    }

    const token = jwt.sign(
      { sub: authUser._id.toString() },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: authUser._id,
        name: authUser.name,
        role: authUser.role,
      },
    });
  } catch (error) {
    console.error(error)
  }
}

// Verify OTP for the sign-up process
async function verifyOTP(req, res) {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).send("Email & OTP required");
    }

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (findUser.verified) {
      return res.status(400).send("User already verified");
    }

    if (!findUser.otp || String(otp) !== String(findUser.otp)) {
      return res.status(400).send("Invalid OTP");
    }

    findUser.verified = true;
    findUser.otp = undefined; // Remove OTP after successful verification

    await findUser.save();

    return res.status(200).send("User verified successfully");
  } catch (error) {
    console.error(error);

    return res.status(500).send("Something went wrong");
  }
}

async function allUsers(req, res) {
  try {
    const users = await Auth.find({
      role: { $in: ["user", "seller"] },
    })
      .select("_id name email role verified isActive")
      .limit(100)
      .lean();

    return res.status(200).json({
      message: "Buyers and sellers fetched successfully",
      users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not fetch users",
    });
  }
}

module.exports = { signUp, signIn, verifyOTP, allUsers }