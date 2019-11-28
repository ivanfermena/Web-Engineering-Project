"use strict";

const express = require('express')
const path = require('path')

const loginRouter = express.Router()
const services = require("../services/loginService")

loginRouter.get("", function (request, response) {
    response.status(200)
    response.render("login");
});

loginRouter.post("", services.isUserCorrect)

module.exports = loginRouter;