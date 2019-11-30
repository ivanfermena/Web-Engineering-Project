"use strict";

const express = require('express')
const path = require('path')

const loginRouter = express.Router()
const loginController = require("../controllers/loginController")

loginRouter.get("", loginController.getPage);

loginRouter.post("", loginController.isUserCorrect)


module.exports = loginRouter;