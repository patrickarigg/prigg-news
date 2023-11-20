const express = require("express");
const {
  getEndpointDescriptions,
  getAllTopics,
} = require("./controllers/app.controller");
const { handleServerErrors } = require("./errors");

const app = express();

app.get('/api',getEndpointDescriptions)
app.get('/api/topics',getAllTopics);

app.use(handleServerErrors);

module.exports = app;
