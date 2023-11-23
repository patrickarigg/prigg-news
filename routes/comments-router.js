const { deleteCommentById } = require("../controllers/app.controller");

const commentsRouter = require("express").Router();

//requests
commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
