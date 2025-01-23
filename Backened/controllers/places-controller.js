const httpError = require("../models/errorModel");
const getCoordsForAddress = require("../utils/getCoordsForAddress");
const express = require("express");
const app = express();
const { validationResult } = require("express-validator");
app.use(express.json());
const model = require("../models/places-model");
const userModel = require("../models/user-model");
const fs = require("fs");

const getPlacesByPId = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await model.findById(placeId);
    if (!place) {
      return next(
        new Error("Could not find a place for the provided id.", 404)
      );
    }
    res.json({
      place: place.toObject({ getters: true }),
      totalLikes: place.totalLikes,
      totalDislikes: place.totalDislikes,
    });
  } catch (err) {
    return next(
      new Error("Something went wrong, could not find a place.", 500)
    );
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
    const placeToDelete = await model
      .findOne({ _id: pid })
      .populate("creatorId");
    if (!placeToDelete) {
      return next(new httpError(404, `Place with id ${pid} not found`));
    }

    if (placeToDelete.creatorId._id.toString() !== req.userData.userId) {
      return next(new httpError(403, "Unauthorized to delete this place"));
    }

    const ImagePath = placeToDelete.image;
    if (!fs.existsSync(ImagePath)) {
      console.warn("Image path not found:", ImagePath);
    }

    const user = await userModel.findOne({ _id: placeToDelete.creatorId });
    if (!user) {
      return next(new httpError(404, "Creator not found for the place"));
    }

    user.places = user.places.filter((placeId) => placeId.toString() !== pid);
    await user.save();
    await model.findOneAndDelete({ _id: pid });

    fs.unlink(ImagePath, (err) => {
      if (err) {
        console.error("Failed to delete image file:", err);
      }
    });

    return res
      .status(200)
      .json({ message: `Place with ID ${pid} deleted successfully` });
  } catch (err) {
    console.error("Error during deletion:", err);
    return next(new httpError(500, `Deleting place failed: ${err.message}`));
  }
};

const updatePlacesByPId = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new httpError(404, "Please Enter Correct Details");
  }
  const { title, description } = req.body;
  const pid = req.params.pid;
  let place = await model.findOne({ _id: pid });
  if (place.creatorId.toString() !== req.userData.userId) {
    return next(new httpError(403, "Unauthorized to update this place"));
  }
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

  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new model({
    title,
    description,
    image: req.file.path,
    address,
    location: coordinates,
    creatorId: req.userData.userId,
  });

  try {
    const user = await userModel.findOne({ _id: req.userData.userId });
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
// In your backend places controller (controllers/places-controllers.js)

// Advanced search implementation with better matching and sorting

const searchPlaces = async (req, res, next) => {
  const { type, query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.json({ places: [] });
  }

  try {
    let places;
    const searchRegex = new RegExp(query, "i");

    // Create a scoring function to rank results
    const calculateScore = (text, searchQuery) => {
      searchQuery = searchQuery.toLowerCase();
      text = text.toLowerCase();

      // Exact match gets highest score
      if (text === searchQuery) return 100;

      // Contains as whole word
      if (new RegExp(`\\b${searchQuery}\\b`).test(text)) return 75;

      // Contains as part of word
      if (text.includes(searchQuery)) return 50;

      // Partial match
      return 25;
    };

    if (type === "title") {
      places = await model.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex }, // Optional: include description in title search
        ],
      });

      // Score and sort results
      places = places
        .map((place) => ({
          ...place._doc,
          score: calculateScore(place.title, query),
        }))
        .sort((a, b) => b.score - a.score)
        .filter((place) => place.score > 25); // Only return relevant matches
    } else if (type === "city") {
      places = await model.find({ address: searchRegex });

      // Score and sort results
      places = places
        .map((place) => ({
          ...place._doc,
          score: calculateScore(place.address, query),
        }))
        .sort((a, b) => b.score - a.score)
        .filter((place) => place.score > 25);
    }

    console.log(`Found ${places.length} matches for "${query}" in ${type}`);

    res.json({
      places: places.map((place) => ({
        id: place._id,
        title: place.title,
        description: place.description,
        image: place.image,
        address: place.address,
        location: place.location,
        creatorId: place.creator,
      })),
    });
  } catch (err) {
    console.error("Search error:", err);
    return next(new Error("Searching places failed, please try again."));
  }
};

const RateThePlace = async (req, res, next) => {
  const { rating } = req.body;
  const placeId = req.params.pid;
  const userId = req.userData.userId;

  try {
    const place = await model.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Check if user has already rated
    const existingRating = place.ratings.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRating) {
      // Update existing rating
      if (existingRating.rating !== rating) {
        // Update totals
        if (existingRating.rating === 1) place.totalLikes--;
        if (existingRating.rating === -1) place.totalDislikes--;
        if (rating === 1) place.totalLikes++;
        if (rating === -1) place.totalDislikes++;

        existingRating.rating = rating;
        existingRating.createdAt = Date.now();
      }
    } else {
      // Add new rating
      place.ratings.push({
        userId,
        rating,
        createdAt: Date.now(),
      });

      if (rating === 1) place.totalLikes++;
      if (rating === -1) place.totalDislikes++;
    }

    await place.save();

    res.json({
      message: "Rating updated successfully",
      totalLikes: place.totalLikes,
      totalDislikes: place.totalDislikes,
    });
  } catch (err) {
    return next(new Error("Rating failed, please try again."));
  }
};

const getUserRating = async (req, res, next) => {
  const placeId = req.params.pid;
  const userId = req.userData.userId;

  try {
    const place = await model.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const userRating = place.ratings.find(
      (r) => r.userId.toString() === userId.toString()
    );

    res.json({
      rating: userRating ? userRating.rating : null,
    });
  } catch (err) {
    return next(new Error("Getting user rating failed, please try again."));
  }
};

const getAllPlaces = async (req, res, next) => {
  let places;
  try {
    places = await model
      .find({})
      .populate("creatorId", "name image") // This will include user details if needed
      .sort({ createdAt: -1 }); // Optional: sort by newest first
  } catch (err) {
    return next(
      new Error("Fetching places failed, please try again later.", 500)
    );
  }

  if (!places || places.length === 0) {
    return res.json({ places: [] });
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};
exports.getPlacesByPId = getPlacesByPId;
exports.getPlacesByUid = getPlacesByUid;
exports.createNewPlace = createNewPlace;
exports.deletePlaceByPId = deletePlaceByPId;
exports.updatePlacesByPId = updatePlacesByPId;
exports.searchPlaces = searchPlaces;
exports.RateThePlace = RateThePlace;
exports.getUserRating = getUserRating;
exports.getAllPlaces = getAllPlaces;
