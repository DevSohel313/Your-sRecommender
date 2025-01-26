const httpError = require("../models/errorModel");
const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  try {
    console.log("headers", req.headers);
    console.log("authorization: ", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1]; //authorization='bearer token'
    if (!token) {
      return next(new httpError(401, "No token provided"));
    }
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("decodedPayload: ", JSON.stringify(decodedPayload));
    req.userData = { userId: decodedPayload.userId };
    next();
  } catch (err) {
    console.error("Authentication Error:", err);
    return next(new httpError(401, "Authentication failed"));
  }
};
module.exports = authCheck;
