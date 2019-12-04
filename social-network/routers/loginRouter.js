"use strict";

const express = require('express')

const loginRouter = express.Router()
const controller = require("../controllers/loginController")

const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

loginRouter.get("", controller.loadLoginPage)

loginRouter.post("", controller.isUserCorrect)

loginRouter.get("/register", controller.loadRegisterPage)

loginRouter.post("/register", multerFactory.single("user_img"), controller.newUser)

module.exports = loginRouter;