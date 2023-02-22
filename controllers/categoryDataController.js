const {
  fetchAllCategoryData,
  fetchAllReviewData,
  fetchReviewById,
  fetchCommentsByReviewId,
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

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      // console.log(comments);
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.getCommentsByReviewId = (req, res, next) => {
//   const { review_id } = req.params;
//   fetchReviewById(review_id)
//     .then(() => {
//       return fetchCommentsByReviewId(review_id);
//     })
//     .then((comments) => {
//       console.log(comments);
//       res.status(200).send(comments);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
