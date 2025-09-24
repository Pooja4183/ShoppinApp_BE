const User = require("../models/User");

const bcrypt = require("bcryptjs");
const otpService = require("../services/otp.service");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password securely
    const hashPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    // 4. Generate + save OTP in DB and send email
    await otpService.sendOtp(email); // make sure otpService handles saving in DB
   
    // 5. Response
    res.status(201).json({ 
      message: "User registered successfully. OTP sent to email for verification.",
      email 
    });

  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};


exports.getUserProfile = async (req, res) => {
  const { id, email, name } = req.user;  // req.user from auth middleware
  res.status(200).json({ 
    message: "User profile data", 
    user: { id, email, name } 
  });
};
