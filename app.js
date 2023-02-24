const express = require("express");
const app = express();
//get from the controller
const {
  getCategoryData,
  getReviewData,
  getReviewById,
  getCommentsByReviewId,
  patchReviewById,
  postCommentsByReviewId,
} = require("./controllers/categoryDataController");

const {
  handle404nonExistentPaths,
  handle500Errors,
  errorHandler,
  handlePsqlErrors,
  handleReviewNotFoundError,
} = require("./controllers/errorHandler");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/categories", getCategoryData);

app.get("/api/reviews", getReviewData);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.patch("/api/reviews/:review_id", patchReviewById);
app.post("/api/reviews/:review_id/comments", postCommentsByReviewId);

app.use(handle404nonExistentPaths);

app.use(errorHandler);
app.use(handlePsqlErrors);
app.use(handleReviewNotFoundError);

app.use(handle500Errors);

module.exports = app;
