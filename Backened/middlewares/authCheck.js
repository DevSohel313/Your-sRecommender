const httpError = require("../models/errorModel");
const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  try {
    console.log("Auth headers:", req.headers);
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      console.error("No token provided");
      return next(new httpError(401, "No token provided"));
    }
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded payload:", decodedPayload);
    req.userData = { userId: decodedPayload.userId };
    next();
  } catch (err) {
    console.error("Authentication failed:", err.message);
    return next(new httpError(401, "Authentication failed"));
  }
};

module.exports = authCheck;
