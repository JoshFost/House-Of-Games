const db = require("../db/connection");
const format = require("pg-format");

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
        return Promise.reject({ status: 404, msg: "review_id not found" });
      } else {
        return results.rows[0];
      }
    });
};

exports.fetchCommentsByReviewId = (review_id, sort_by) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
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
        return [];
      } else {
        return results.rows;
      }
    });
};

exports.insertPostCommentsByReviewId = (reviewId, username, body) => {
  return db
    .query(
      `
      INSERT INTO comments (review_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [reviewId, username, body]
    )
    .then((results) => {
      const rowCount = results.rowCount;
      if (rowCount === 0) {
        return [];
      } else {
        return results.rows[0];
      }
    });
};
