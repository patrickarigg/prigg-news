const {
  deleteCommentById,
  patchCommentVotes,
} = require("../controllers/app.controller");

const commentsRouter = require("express").Router();

//requests
commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", patchCommentVotes);

module.exports = commentsRouter;
