const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");
const { getEndpointDescriptions } = require("../controllers/app.controller");

const apiRouter = require("express").Router();

//requests
apiRouter.get("", getEndpointDescriptions);

//sub routes
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
