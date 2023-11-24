const {
  getArticleById,
  getAllArticles,
  getCommentsForArticle,
  postComment,
  patchArticleVotes,
  postArticle,
  deleteArticle,
} = require("../controllers/app.controller");

const articlesRouter = require("express").Router();

//requests
articlesRouter.get("", getAllArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsForArticle);
articlesRouter.post("",postArticle)
articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.delete("/:article_id",deleteArticle);

module.exports = articlesRouter;
