"use strict";

const express = require('express')
const path = require('path')

const loginRouter = express.Router()
const loginController = require("../controllers/loginController")

loginRouter.get("", function (request, response) {
    response.status(200)
    response.render("login", {errorMsg: null});
});

loginRouter.post("", loginController.isUserCorrect)


module.exports = loginRouter;