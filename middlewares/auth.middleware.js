const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 1. get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // keeping the token part only

  // 2. If token not found deny access
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // 3. Varify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. attach decoded user info to the request
    req.user = decoded;

    // 5. Move to the next middleware
    next();
  } catch (err) {
    return res.status(403).json({message:"Invalid or expiry token."})
  }

};
