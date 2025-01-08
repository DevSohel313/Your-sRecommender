const { validationResult } = require("express-validator");
const httpError = require("../models/errorModel");
const model = require("../models/user-model");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await model.find().populate("places");
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
        console.log("Logged In Success");
        res.json({ user: user });
      } else {
        return next(new httpError(404, "Invalid email or password!"));
      }
    });
  }
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
  bcrypt.hash(password, password.length, async (err, hash) => {
    const user = await model.create({
      name,
      email,
      password: hash,
      image,
    });
    res.json({ user: user });
  });
};

exports.getUsers = getUsers;
exports.userLogin = userLogin;
exports.userSignUp = userSignUp;
