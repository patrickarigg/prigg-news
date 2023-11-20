const express = require("express");
const { getAllTopics } = require("./controllers/app.controller");
const { handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();

app.get('/api/topics',getAllTopics);

app.use(handleServerErrors);

module.exports = app;
