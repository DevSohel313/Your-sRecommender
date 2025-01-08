const express = require("express");
const placesRouter = require("./routes/places-route");
const app = express();
const db = require("./config/mongoose-connection");
const userRouter = require("./routes/user-routes");
const cors = require("cors");
const httpError = require("./models/errorModel");
app.use(cors());
app.use(express.json());
app.use("/api/places", placesRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  throw new httpError(404, "Page Not Found");
});
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.statusCode || 500).json({
    message: error.message || "An unknown error occurred.",
  });
});
app.listen(5000);
