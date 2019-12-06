"use strict";

const express = require('express')

const userRouter = express.Router()
const controller = require("../controllers/userController")

const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

userRouter.get("/image/:userId", controller.getUserImage)

userRouter.get("/modify", controller.loadModifyPage)
userRouter.post("/modify", multerFactory.single("user_img"), controller.modifyUser)


userRouter.get("/profile", controller.getUser)
userRouter.post("/profile", controller.getUser)


userRouter.get("/friends", controller.getFriends);


userRouter.get("/accept/:userId", controller.acceptRequest);
userRouter.get("/denied/:userId", controller.deniedRequest);


userRouter.get("/requestFriend/:userId", controller.requestFriend);


userRouter.get("/search", function (request, response) {
    response.status(200)
    response.render("users/friends")
});
userRouter.post("/search", controller.searchUsers);

userRouter.get("/signout", controller.signout);

module.exports = userRouter;