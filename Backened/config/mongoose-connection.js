const mongoose = require("mongoose");

// Replace the local connection string with the MongoDB Atlas connection string
mongoose
  .connect(
    "mongodb+srv://sohaildarwajkarrocks:Sohel313@mycluster.d7ajh.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection failed:", err));

module.exports = mongoose.connection;
