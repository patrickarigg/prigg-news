const {
  selectEndpointDescriptions,
  selectAllTopics,
} = require("../models/app.model");

exports.getEndpointDescriptions = (req, res, next) => {
  selectEndpointDescriptions().then((endpointDescriptions) => {
    res.status(200).send({ endpointDescriptions });
  })
  .catch(next)
};

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
