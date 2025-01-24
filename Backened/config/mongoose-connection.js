const mongoose = require("mongoose");

// Replace the local connection string with the MongoDB Atlas connection string
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection failed:", err));

module.exports = mongoose.connection;
