const { selectAllTopics } = require("../models/app.model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then(({ rows }) => {
      const topics = rows;
      res.status(200).send({ topics });
    })
    .catch(next);
};
