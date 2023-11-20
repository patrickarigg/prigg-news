const {
  selectEndpointDescriptions,
  selectAllTopics,
  selectArticleById,
  selectAllArticles,
} = require("../models/app.model");

exports.getEndpointDescriptions = (req, res, next) => {
  selectEndpointDescriptions()
    .then((endpointDescriptions) => {
      res.status(200).send({ endpointDescriptions });
    })
    .catch(next);
};

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
