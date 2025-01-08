const httpError = require("../models/errorModel");
const getCoordsForAddress = require("../utils/getCoordsForAddress");
const express = require("express");
const app = express();
const { validationResult } = require("express-validator");
app.use(express.json());
const model = require("../models/places-model");
const userModel = require("../models/user-model");

const getPlacesByPId = async (req, res, next) => {
  const id = req.params.pid;
  const place = await model.findOne({ _id: id }).populate("creatorId");
  if (place) {
    return res.json(place);
  } else {
    const error = new httpError(404, `Place with id ${id} not found`);
    return next(error);
  }
};

const getPlacesByUid = async (req, res, next) => {
  const uid = req.params.uid;
  const UserWithPlaces = await userModel
    .findOne({ _id: uid })
    .populate("places");
  if (UserWithPlaces) {
    return res.json({ places: UserWithPlaces.places });
  } else {
    return next(new httpError(404, `User with id ${uid} not found`));
  }
};

const deletePlaceByPId = async (req, res, next) => {
  const pid = req.params.pid;
  try {
    const placeToDelete = await model.findOne({ _id: pid });
    if (!placeToDelete) {
      return next(new httpError(404, `Place with id ${pid} not found`));
    }

    // Find the user associated with the place
    const user = await userModel.findOne({ _id: placeToDelete.creatorId });
    if (!user) {
      return next(new httpError(404, "Creator not found for the place"));
    }
    user.places = user.places.filter((placeId) => placeId.toString() !== pid);
    await user.save();
    await model.findOneAndDelete({ _id: pid });
    return res
      .status(200)
      .json({ message: `Place with ID ${pid} deleted successfully` });
  } catch (err) {
    return next(new httpError(500, "Deleting place failed, please try again"));
  }
};

const updatePlacesByPId = async (req, res, next) => {
  const error = validationResult(req);
  console.log(error);
  if (!error.isEmpty()) {
    throw new httpError(404, "Please Enter Correct Details");
  }
  const { title, description } = req.body;
  const pid = req.params.pid;
  let placetoUpdate;
  try {
    placetoUpdate = await model.findOneAndUpdate(
      { _id: pid },
      { title, description },
      { new: true }
    );
  } catch (err) {
    return next(new httpError(404, `Place with id ${pid} not found`));
  }
  res.json({ UpdatedPlace: placetoUpdate });
};
const createNewPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError(400, "Please Enter Correct Details"));
  }

  const { title, description, image, address, creatorId } = req.body;
  let coordinates;
  console.log(title, description, address, creatorId);
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new model({
    title,
    description,
    image,
    address,
    location: coordinates,
    creatorId,
  });

  try {
    const user = await userModel.findOne({ _id: creatorId });
    if (!user) {
      return next(new httpError(404, "User not found"));
    }

    // Save the place and update the user's places array
    await createdPlace.save(); //
    user.places.push(createdPlace._id); // Add the place's ID to the user's places array
    await user.save(); // Save the updated user

    return res.status(201).json(createdPlace);
  } catch (err) {
    console.log(err);
    return next(new httpError(500, "Failed to create place"));
  }
};

exports.getPlacesByPId = getPlacesByPId;
exports.getPlacesByUid = getPlacesByUid;
exports.createNewPlace = createNewPlace;
exports.deletePlaceByPId = deletePlaceByPId;
exports.updatePlacesByPId = updatePlacesByPId;
