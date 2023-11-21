const express = require("express");

const {
  handlePostgresErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");

const {
  getEndpointDescriptions,
  getAllTopics,
  getArticleById,
  getAllArticles,
  getCommentsForArticle,
  postComment,
  patchArticleVotes,
  deleteCommentById,
} = require("./controllers/app.controller");

const app = express();

app.use(express.json())

app.get("/api", getEndpointDescriptions);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments",getCommentsForArticle);

app.post("/api/articles/:article_id/comments",postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id",deleteCommentById);

app.use(handlePostgresErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
