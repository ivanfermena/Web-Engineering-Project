"use strict";

const express = require('express')

const { check } = require('express-validator');

const loginRouter = express.Router()
const controller = require("../controllers/loginController")

const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

loginRouter.get("", controller.loadLoginPage)

loginRouter.post("",[
    check('user_email').isEmail().withMessage('Formato de email incorrecto'),
    check('user_email').notEmpty().withMessage('Email obligatorio'),
    check('user_password').notEmpty().withMessage('Contraseña obligatoria'),

  ], controller.isUserCorrect)

loginRouter.get("/register", controller.loadRegisterPage)

loginRouter.post("/register",[
    check('user_email').isEmail().withMessage('Formato de email incorrecto'),
    check('user_email').notEmpty().withMessage('Email obligatorio'),
    check('user_password').notEmpty().withMessage('Contraseña obligatoria'),
    check('user_name').notEmpty().withMessage('Nombre obligatorio'),
    check('user_name').isAlphanumeric().withMessage('Nombre con caracteres raros'),
    check('user_birthday').isBefore().withMessage('Necesaria fecha antigua')
    //check('user_img').contains(".png").contains(".jpg").withMessage('Imagen incorrecta')
  ], multerFactory.single("user_img"), controller.newUser)

module.exports = loginRouter;