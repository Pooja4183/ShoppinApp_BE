const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpService = require("../services/otp.service");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // 2. Hash password securely
    const hashPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const newAdmin = new Admin({ name, email, password: hashPassword });
    await newAdmin.save();

    // 4. Generate + save OTP in DB and send email
    //await otpService.sendOtp(email); // make sure otpService handles saving in DB

    // 5. Response
    res.status(201).json({
      message:
        "Admin registered successfully.",
      email,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body; // object destructuring

  try {
    // 1. check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid email" });
    // 2. compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "invalid password" });

    // 3. create JWT token
    // const token = jwt.sign(
    //   { id: admin._id, email: admin.email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );
    // 4. send token + user info (exluding password)
    res.status(200).json({
     // token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.getAdminProfile = async (req, res) => {
//   const { id, email, name } = req.admin;  // req.user from auth middleware
//   res.status(200).json({
//     message: "Admin profile data",
//     admin: { id, email, name }
//   });
// };
