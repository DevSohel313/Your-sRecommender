// models/user.js
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const User = mongoose.Schema(
  {
    name: { type: "string", required: "true" },
    email: { type: "string", required: "true", unique: true },
    password: { type: "string", required: "true", minlength: 4 },
    image: { type: "string" },
    places: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
      },
    ],
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
    createdAt: {
      type: Date,
      default: Date.now, // This will automatically set the date when a user is created
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

User.plugin(uniqueValidator);

module.exports = mongoose.model("User", User);
