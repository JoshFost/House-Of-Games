const db = require("../db/connection");
const format = require("pg-format");
const { getCategoryData } = require("../controllers/categoryDataController");

exports.fetchAllCategoryData = () => {
  return db
    .query(
      `
      SELECT * FROM categories
    `
    )
    .then((result) => {
      const categories = result.rows;
      return categories;
    });
};

exports.fetchAllReviewData = () => {
  return db
    .query(
      `
    SELECT reviews.*, 
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
  `
    )
    .then((result) => {
      const results = result.rows;
      return results;
    });
};

exports.fetchReviewById = (review_id, sort_by) => {
  return db
    .query(
      `
    SELECT reviews.*, 
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
    `,
      [review_id]
    )
    .then((results) => {
      const rowCount = results.rowCount;
      if (rowCount === 0) {
        const error = new Error("review_id not found");
        error.status = 404;
        throw error;
        // return Promise.reject("review_id not found");
      } else {
        return results.rows[0];
      }
    });
};

exports.fetchCommentsByReviewId = (review_id, sort_by) => {
  if (isNaN(review_id)) {
    const error = new Error("Bad Request");
    error.status = 400;
    throw error;
  }
  return db
    .query(
      `
    SELECT *, comments.comment_id
    FROM comments
    WHERE comments.review_id =$1
    ORDER BY comments.created_at DESC
    `,
      [review_id]
    )
    .then((results) => {
      const rowCount = results.rowCount;
      if (rowCount === 0) {
        const error = new Error("review_id not found");
        error.status = 404;
        throw error;
      } else {
        return results.rows;
      }
    });
};
