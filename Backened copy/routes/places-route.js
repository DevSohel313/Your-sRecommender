const express = require("express");
const app = express();
app.use(express.json());
const Route = express.Router();
const { check } = require("express-validator");
const authCheck = require("../middlewares/authCheck");
const placesContoller = require("../controllers/places-controller");
const fileUpload = require("../middlewares/fileUpload");
Route.get("/search", placesContoller.searchPlaces);
Route.get("/:pid", placesContoller.getPlacesByPId);
Route.get("/user/:uid", placesContoller.getPlacesByUid);
Route.use(authCheck);
Route.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesContoller.updatePlacesByPId
);
Route.delete("/:pid", placesContoller.deletePlaceByPId);

Route.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesContoller.createNewPlace
);

module.exports = Route;
