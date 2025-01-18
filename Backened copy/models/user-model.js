const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const User = mongoose.Schema({
  name: { type: "string", required: "true" },
  email: { type: "string", required: "true", unique: true },
  password: { type: "string", required: "true", minlength: 4 },
  image: { type: "string" },
  places: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place", // This will link the Place model to the User model, allowing us to fetch related places
    },
  ],
  resetToken: { type: String }, // For storing the password reset token
  resetTokenExpiration: { type: Date }, // Token expiration time
});

User.plugin(uniqueValidator);
module.exports = mongoose.model("User", User);
