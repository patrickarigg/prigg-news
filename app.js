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
} = require("./controllers/app.controller");

const app = express();

app.get("/api", getEndpointDescriptions);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments",getCommentsForArticle);

app.use(handlePostgresErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
