exports.handlePostgresErrors = (err, req, res, next) => {
  next(err)
};

exports.handleCustomErrors = (err, req, res, next) => {
  next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
