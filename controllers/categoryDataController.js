const {
  fetchAllCategoryData,
  fetchAllReviewData,
} = require("../models/categoryDataModel");
const app = require("../app");

exports.getCategoryData = (req, res, next) => {
  fetchAllCategoryData()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewData = (req, res, next) => {
  fetchAllReviewData()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};
