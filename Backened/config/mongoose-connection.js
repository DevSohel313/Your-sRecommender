const mongoose = require("mongoose");
const dbURI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_DEV;
// Replace the local connection string with the MongoDB Atlas connection string
mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection failed:", err));

module.exports = mongoose.connection;
