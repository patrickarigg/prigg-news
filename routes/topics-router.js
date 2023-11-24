const { getAllTopics, postTopic } = require("../controllers/app.controller");

const topicsRouter = require("express").Router();

//requests
topicsRouter.get("", getAllTopics);
topicsRouter.post("",postTopic)

module.exports = topicsRouter
