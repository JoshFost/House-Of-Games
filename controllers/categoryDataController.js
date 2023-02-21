const {
  fetchAllCategoryData,
  fetchAllReviewData,
  fetchReviewById,
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

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
