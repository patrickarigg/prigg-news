const express = require("express");

const {
  handlePostgresErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");
const apiRouter = require("./routes/api-router");
const { handleInvalidEndpoints } = require("./controllers/app.controller");

const app = express();

app.use(express.json())

//routes
app.use("/api", apiRouter);

//handle non-matching paths
app.all("*", handleInvalidEndpoints);

//error handlers
app.use(handleCustomErrors);
app.use(handlePostgresErrors);
app.use(handleServerErrors);

module.exports = app;
