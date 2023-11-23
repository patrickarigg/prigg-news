const { getAllTopics } = require("../controllers/app.controller");

const topicsRouter = require("express").Router();

//requests
topicsRouter.get("", getAllTopics);

module.exports = topicsRouter
