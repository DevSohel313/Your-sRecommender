const mongoose = require("mongoose");

const Place = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This will link the Place model to the User model, allowing us to fetch related places
  },
});

module.exports = mongoose.model("Place", Place);
