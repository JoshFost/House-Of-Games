const express = require("express");
const app = express();
const {
  getCategoryData,
  getReviewData,
} = require("./controllers/categoryDataController");
const { handle404nonExistentPaths } = require("./controllers/errorHandler");

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/categories", getCategoryData);

app.get("/api/reviews", getReviewData);

// app.use(errorHandler);
app.use(handle404nonExistentPaths);
module.exports = app;
