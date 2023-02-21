exports.errorHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.status === 404) {
    res.status(404).send({ msg: "Not Found" });
  } else if (err.status === 500) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
