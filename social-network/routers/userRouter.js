"use strict";

const express = require('express')

const userRouter = express.Router()
const services = require("../controllers/userService")

const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

userRouter.get("/register", function (request, response) {
    response.status(200)
    response.render("users/register")
})
userRouter.post("/register", multerFactory.single("user_img"), services.newUser)


userRouter.get("/modify", function (request, response) {
    response.status(200)
    response.render("users/modify")
})
userRouter.post("/modify", multerFactory.single("user_img"), services.modifyUser)


userRouter.get("/profile", services.getUser)
userRouter.post("/profile", services.getUser)


userRouter.get("/friends", services.getFriends);


userRouter.get("/accept/:userId", services.acceptRequest);
userRouter.get("/denied/:userId", services.deniedRequest);


userRouter.get("/requestFriend/:userId", services.requestFriend);


userRouter.get("/search", function (request, response) {
    response.status(200)
    response.render("users/friends")
});
userRouter.post("/search", services.searchUsers);

userRouter.get("/signout", services.signout);

module.exports = userRouter;