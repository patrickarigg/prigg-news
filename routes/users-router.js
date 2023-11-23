const { getAllUsers } = require("../controllers/app.controller");

const usersRouter = require("express").Router();

//requests
usersRouter.get("", getAllUsers);

module.exports = usersRouter
