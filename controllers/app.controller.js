const {
  selectEndpointDescriptions,
  selectAllTopics,
  selectArticleById,
  selectAllArticles,
  selectCommentsForArticle,
  insertComment,
  updateArticleVotes,
  deleteComment,
  selectAllUsers,
  selectUserByUsername,
  updateCommentVotes,
  insertArticle,
} = require("../models/app.model");
const { checkExists } = require("../models/utils.model");

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
  const { topic, sort_by, order } = req.query;
  const articlePromises = [selectAllArticles(topic, sort_by, order)];
  if (topic) {
    articlePromises.push(checkExists("topics", "slug", topic));
  }
  Promise.all(articlePromises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsForArticle = (req, res, next) => {
  const id = req.params.article_id;

  const commentPromises = [
    selectCommentsForArticle(id),
    checkExists("articles", "article_id", id),
  ];

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const article_id = req.params.article_id;
  insertComment(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const inc_votes = req.body.inc_votes;

  const patchArticlePromises = [
    updateArticleVotes(article_id, inc_votes),
    checkExists("articles", "article_id", article_id),
  ];

  Promise.all(patchArticlePromises)
    .then((resolvedPromises) => {
      const updatedArticle = resolvedPromises[0];
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  checkExists("comments", "comment_id", comment_id)
    .then(() => {
      deleteComment(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const inc_votes = req.body.inc_votes;

  const patchCommentsPromises = [
    updateCommentVotes(comment_id, inc_votes),
    checkExists("comments", "comment_id", comment_id),
  ];

  Promise.all(patchCommentsPromises)
    .then((resolvedPromises) => {
      const updatedComment = resolvedPromises[0];
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  checkExists("users", "username", newArticle.author)
    .then(() => {
      return insertArticle(newArticle);
    })
    .then((article)=>{
      return selectArticleById(article.article_id)
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
