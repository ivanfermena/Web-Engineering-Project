"use strict";

const express = require('express')

const loginRouter = express.Router()
const loginController = require("../controllers/loginController")

loginRouter.get("", loginController.getPage);

loginRouter.post("", loginController.isUserCorrect)


module.exports = loginRouter;