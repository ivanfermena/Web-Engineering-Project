"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoUser = require('./../models/user')

const pool = mysql.createPool(config.mysqlConfig)

const DaoUser = new daoUser(pool)

function loadLoginPage(request, response) {
    response.status(200)
    response.render("login/login", { errores: 0 })
}

function loadRegisterPage(request, response) {
    response.status(200)
    response.render("login/register", { errores: 0 });
}

function isUserCorrect(request, response, next) {

    request.checkBody('user_email').isEmail().withMessage('Formato de email incorrecto')
    request.checkBody('user_email').notEmpty().withMessage('Email obligatorio')
    request.checkBody('user_password').notEmpty().withMessage('Contraseña obligatoria')

    request.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            response.status(400)
            response.setFlash("Incorrect email or password")
            response.render("login/login", { errores: result.mapped() })
        }
        else {
            let userRequested = {
                email: request.body.user_email,
                password: request.body.user_password
            }

            DaoUser.isUserCorrect(userRequested.email, userRequested.password, function (err, userId) {
                if (err) {
                    next(err)
                }
                else if (userId == -1) {
                    response.status(401)
                    response.setFlash("Incorrect email or password")
                    response.redirect("/login")
                }
                else {
                    response.status(200)
                    request.session.currentUser = { id: userId, points: 0 }
                    response.redirect("/user/profile/" + userId)
                }
            })
        }
    })
}

function newUser(request, response, next) {

    request.checkBody('user_email').notEmpty().withMessage('Email obligatorio')
    request.checkBody('user_email').isEmail().withMessage('Formato de email incorrecto')
    request.checkBody('user_password').notEmpty().withMessage('Contraseña obligatoria')
    request.checkBody('user_name').notEmpty().withMessage('Nombre obligatorio')
    request.checkBody('user_name').isAlphanumeric().withMessage('Nombre con caracteres no válidos')
    request.checkBody('user_genre').notEmpty().withMessage('Género obligatorio')
    request.checkBody('user_birthday').notEmpty().withMessage('Fecha de nacimiento obligatoria')
    request.checkBody('user_birthday').isBefore().withMessage('Necesaria fecha anterior')

    request.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            response.status(400)
            response.setFlash("Some field not filled")
            response.render("login/register", { errores: result.mapped() })
        }
        else {
            let userRequested = {
                email: request.body.user_email,
                password: request.body.user_password,
                name: request.body.user_name,
                genre: request.body.user_genre,
                birthday: request.body.user_birthday,
                image: null
            }

            if (request.file) {
                userRequested.image = request.file.buffer
            }

            DaoUser.newUser(userRequested.email, userRequested.password, userRequested.name, 
                userRequested.genre, userRequested.image, userRequested.birthday,
                function (err, userId) {
                    if (err) {
                        next(err)
                    } 
                    else if (userId > 0) {
                        response.status(200)
                        request.session.currentUser = { id: userId, points: 0 }

                        response.redirect('/user/profile/' + userId)
                    }
                })
        }
    })
}

module.exports = {
    loadLoginPage: loadLoginPage,
    loadRegisterPage: loadRegisterPage,
    isUserCorrect: isUserCorrect,
    newUser: newUser
};
