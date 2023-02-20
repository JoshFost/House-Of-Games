const express = require("express");
const app = express();
const { getCategoryData } = require("./controllers/categoryDataController");
const { errorHandler } = require("./controllers/errorHandler");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/categories", getCategoryData);
// console.log(getCategoryData);
app.use(errorHandler);
module.exports = app;
