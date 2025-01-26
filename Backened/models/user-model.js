const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userName: {
      type: String,
      unique: true,
      maxlength: 10,
      validate: {
        validator: async function (value) {
          const existingUser = await this.constructor.findOne({
            userName: value,
          });
          return !existingUser;
        },
        message: "Username already exists",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (value) {
          const existingUser = await this.constructor.findOne({ email: value });
          return !existingUser;
        },
        message: "Email already exists",
      },
    },
    password: { type: String, required: true, minlength: 4 },
    image: { type: String },
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
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
