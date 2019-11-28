"use strict";

const express = require('express')
const path = require('path')

const userRouter = express.Router()
const services = require("../services/loginService")

userRouter.post("/login", services.isUserCorrect)

module.exports = userRouter;