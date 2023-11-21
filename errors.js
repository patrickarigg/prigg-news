exports.handlePostgresErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") { //violates foreign key constraint
    res.status(404).send({ msg: "not found" });
  } else if (err.code==="23502"){ //violating non-null constraint
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
