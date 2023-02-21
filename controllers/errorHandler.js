exports.errorHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.status === 404) {
    res.status(404).send({ msg: "Not Found" });
  } else if (err.status === 500) {
    res.status(500).send({ msg: "Internal Server Error" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "couldnt find the review") {
    response.status(404).send({ msg: "Not Found" });
  }
};

exports.handle404nonExistentPaths = (request, response, next) => {
  response.status(404).send({ msg: "Path Not Found" });
};
exports.handle500Errors = (err, req, res, next) => {
  response.status(500).send({ msg: "Internal server error" });
};
