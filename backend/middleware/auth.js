const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    console.log("Auth Header:", authHeader);
    const token = authHeader?.replace("Bearer ", "");
    console.log("Extracted Token:", token);

    if (!token) {
      console.log("Protect middleware: No token found.");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token (ID, Role):", decoded.id, decoded.role);

    // Get user from token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("Protect middleware: User not found for decoded ID.");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log("Protect middleware: User attached to request:", req.user.email);
    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message);
    console.error("Protect middleware stack:", err.stack);
    res.status(401).json({ message: "Token is not valid or expired", error: err.message });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
