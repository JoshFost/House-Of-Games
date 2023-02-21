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
      //   console.log(categories);
      return categories;
    });
};

exports.fetchAllReviewData = () => {
  return db
    .query(
      `
    SELECT 
      reviews.*, 
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
