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
