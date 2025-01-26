const mongoose = require("mongoose");
require("dotenv").config();

console.log("Environment Variables:", {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI_DEV: process.env.MONGO_URI_DEV,
  MONGO_URI_PROD: process.env.MONGO_URI_PROD,
});

const dbURI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_DEV;
console.log("Connecting to database with URI:", dbURI); // Check the URI value

mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection failed:", err));

module.exports = mongoose.connection;
