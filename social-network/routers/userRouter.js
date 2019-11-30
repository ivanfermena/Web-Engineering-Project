"use strict";

const express = require('express')
const path = require('path')

const userRouter = express.Router()
const services = require("../controllers/userService")

userRouter.get("/register", function (request, response) {
    response.status(200)
    response.render("users/register");
});

userRouter.post("/register", services.newUser)

userRouter.get("/profile", services.getUser);

module.exports = userRouter;