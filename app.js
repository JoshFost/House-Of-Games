const express = require("express");
const app = express();
const {
  getCategoryData,
  getReviewData,
  getReviewById,
  getCommentsByReviewId,
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

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.use(handle404nonExistentPaths);

app.use(errorHandler);

app.use(handle500Errors);

module.exports = app;
/*
DAY 2 comments
currently in main and finished task 5
need to
create new branch for 6
do the code
add and commit
pull if from the main branch?
push to remote feature branch
create pull request
send pr on slack
*/
