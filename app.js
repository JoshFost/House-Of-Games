const express = require("express");
const app = express();
const {
  getCategoryData,
  getReviewData,
  getReviewById,
} = require("./controllers/categoryDataController");

const {
  handle404nonExistentPaths,
  handle500Errors,
  errorHandler,
  handleCustomErrors,
} = require("./controllers/errorHandler");

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/categories", getCategoryData);

app.get("/api/reviews", getReviewData);

app.get("/api/reviews/:review_id", getReviewById);

app.use(handle404nonExistentPaths);
app.use(handle500Errors);
app.use(handleCustomErrors);
app.use(errorHandler);
module.exports = app;
