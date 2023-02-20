const { fetchAllCategoryData } = require("../models/categoryDataModel");

exports.getCategoryData = (req, res, next) => {
  fetchAllCategoryData()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

// console.log(categoryData);
// exports.getCategoryData = (req, res, next) => {
//   const { categoryData } = req.params;
//   fetchAllCategoryData(categoryData, (err, data) => {
//     res.status(200).send({ data });
//   }).catch((err) => {
//     next(err);
//   });
// };
