exports.errorHandler = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "the server received an error!" });
};
