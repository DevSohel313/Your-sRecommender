const { validationResult } = require("express-validator");
const httpError = require("../models/errorModel");
const model = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const sendResetEmail = require("../utils/emailHelper");
const { request } = require("express");
const getUsers = async (req, res, next) => {
  try {
    const allUsers = await model.find({}, "-password").populate("places");
    res.json({ users: allUsers });
  } catch (err) {
    return next(new httpError(500, "Something went wrong"));
  }
};
const userLogin = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError(400, "Please Enter Correct Email or Password"));
  }
  const { email, password } = req.body;
  let user;
  try {
    user = await model.findOne({ email });
  } catch (err) {
    return next(new httpError(500, "Something went wrong"));
  }
  if (!user) {
    return next(new httpError(404, "Invalid email or password!"));
  } else {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          "my-secret-key"
        );
        res
          .status(201)
          .json({ userId: user._id, email: user.email, token: token });
      } else {
        return next(new httpError(404, "Invalid email or password!"));
      }
    });
  }
};

const hasUsers = async (req, res) => {
  try {
    const userCount = await model.find({});
    res.status(200).json({ hasUsers: userCount.length > 0 });
  } catch (err) {
    res.status(500).json({ message: "Fetching user data failed." });
  }
};

const forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  const user = await model.findOne({ email: email });
  console.log(user._id);
  if (user.length === 0) {
    return next(new httpError(401, "No Such User Exists!!"));
  } else {
    const token = jwt.sign({ id: user._id, email: email }, "my-secret-key", {
      expiresIn: "1d",
    });
    //exow kkrz nbsn staa
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sohaildarwajkarrocks@gmail.com",
        pass: "exow kkrz nbsn staa",
      },
      tls: {
        rejectUnauthorized: false, // Disable certificate validation
      },
    });

    var mailOptions = {
      from: "sohaildarwajkarrocks@gmail.com",
      to: "sohel.22210399@viit.ac.in",
      subject: "Sending Email using Node.js",
      text: `http://localhost:5173/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent Successfully");
      }
    });
    res.json("success");
  }
};

const resetPassword = async (req, res, next) => {
  console.log(req.params);
  console.log(req.body.newPassword);
  const { id, token } = req.params;
  const password = req.body.newPassword;
  const user = await model.findOne({ _id: id });
  if (!user) {
    return next(new httpError(404, "User not found"));
  }
  const isTokenValid = jwt.verify(token, "my-secret-key");
  if (!isTokenValid) {
    return next(new httpError(403, "Token is invalid or expired"));
  }
  bcrypt
    .hash(password, 12)
    .then(async (hash) => {
      const updatedUser = await model.findOneAndUpdate(
        { _id: id },
        { password: hash },
        { new: true }
      );
      res.json({ message: "Password updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      return next(new httpError(500, "Failed to hash password"));
    });
};

const userSignUp = async (req, res, next) => {
  const { name, email, password, image } = req.body;

  let existingUser;
  try {
    existingUser = await model.findOne({ email });
  } catch (err) {
    return next(new httpError(400, "Something went wrong"));
  }
  if (existingUser) {
    return next(new httpError(404, "User already exists"));
  }
  bcrypt.hash(password, 12, async (err, hash) => {
    if (err) {
      console.error("Error during password hashing:", err);
      return next(new httpError(500, "Failed to hash password"));
    }
    const user = await model.create({
      name,
      email,
      password: hash,
      places: [],
      image: req.file.path,
    });

    let token;
    try {
      token = jwt.sign(
        { userId: user._id, email: user.email },
        "my-secret-key"
      );
    } catch (err) {
      return next(new httpError(500, "Failed to generate token"));
    }
    res.status(201).json({ userId: user._id, email: user.email, token: token });
  });
};

exports.getUsers = getUsers;
exports.userLogin = userLogin;
exports.userSignUp = userSignUp;
exports.hasUsers = hasUsers;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
