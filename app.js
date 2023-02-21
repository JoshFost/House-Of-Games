const express = require("express");
const app = express();
const {
  getCategoryData,
  getReviewData,
} = require("./controllers/categoryDataController");
const { errorHandler } = require("./controllers/errorHandler");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/categories", getCategoryData);

app.get("/api/reviews", getReviewData);

// app.use((res, req, next) => {
//   response.status(404).send({ msg: "Not Found" });
// });

app.use(errorHandler);

module.exports = app;
//NOTES FROM DAY 1
//currently finished task 4 but receiving odd message in the terminal.
//currently on branch 4. and have add but not yet commited
//make sure i commit and send pull request in the morning and checkout to main!!!
