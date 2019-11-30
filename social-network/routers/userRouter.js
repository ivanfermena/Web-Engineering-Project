"use strict";

const express = require('express')
const path = require('path')
const multer = require("multer");

const storage = multer.memoryStorage()
const upload = multer({ storage })

const userRouter = express.Router()
const services = require("../controllers/userService")

userRouter.get("/register", function (request, response) {
    response.status(200)
    response.render("users/register");
});

//userRouter.post("/register",upload.single("user_img"), services.newUser)

userRouter.post('/register', upload.single('user_img'),  function(req, res) {
    console.log("Hola!!", req.files);
  });

userRouter.get("/profile", services.getUser);

module.exports = userRouter;