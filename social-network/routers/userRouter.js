"use strict";

const express = require('express')
const path = require('path')

const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

const userRouter = express.Router()
const services = require("../controllers/userService")

userRouter.get("/register", function (request, response) {
    response.status(200)
    response.render("users/register");
});

userRouter.post("/register", multerFactory.single("user_img"), services.newUser)

userRouter.get("/modify", function (request, response) {
    response.status(200)
    response.render("users/modify");
});

userRouter.post("/modify", multerFactory.single("user_img"), services.modifyUser)

userRouter.get("/profile", services.getUser);

userRouter.get("/signout", services.signout);


module.exports = userRouter;