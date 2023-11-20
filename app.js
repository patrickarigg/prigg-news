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
} = require("./controllers/app.controller");

const app = express();

app.get("/api", getEndpointDescriptions);
app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handlePostgresErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;