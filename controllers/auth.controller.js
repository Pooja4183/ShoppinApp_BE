const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



const loginUser = async (req, res) => {
  const { email, password } = req.body; // object destructuring

  try {
    // 1. check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    // 2. compare hashed password
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(401).json({message:"invalid password"});

    // 3. create JWT token
    const token = jwt.sign(
        {id:user._id, email:user.email},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    );
    // 4. send token + user info (exluding password)
    res.status(200).json({
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }
    });

  } catch (err) {
    console.error("Login error:",err.message);
    res.status(500).json({message:"Server error"});
  }
};

module.exports = {loginUser};
