const express = require("express");
const app = express();
app.use(express.json());
const Route = express.Router();
const { check } = require("express-validator");

const placesContoller = require("../controllers/places-controller");
Route.get("/:pid", placesContoller.getPlacesByPId);
Route.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesContoller.updatePlacesByPId
);
Route.delete("/:pid", placesContoller.deletePlaceByPId);
Route.get("/user/:uid", placesContoller.getPlacesByUid);
Route.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesContoller.createNewPlace
);
module.exports = Route;
