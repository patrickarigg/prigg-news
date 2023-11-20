const express = require("express");
const { getAllTopics } = require("./controllers/app.controller");
const { handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();
app.use(express.json());

app.get('/api/topics',getAllTopics);


app.use(handlePostgresErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
