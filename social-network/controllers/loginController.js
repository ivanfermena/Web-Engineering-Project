"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoUser = require('./../models/user')

const { check, validationResult } = require('express-validator');

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

    const errors = validationResult(request)

    if (!errors.isEmpty()) {
        response.status(400)
        response.setFlash("Email or password field not filled")
        response.render("login/login", { errores: errors.mapped() })
    }
    else{ 
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
                request.session.currentUser = {id: userId, points: 0} 
                response.redirect("/user/profile/"+userId)
            }
        })
    }
}

function newUser(request, response, next) {

    const errors = validationResult(request)

    if (!errors.isEmpty()) {
        response.status(400)
        response.setFlash("Some field not filled")
        console.log(errors.mapped())
        response.render("login/register", { errores: errors.mapped() })
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

        DaoUser.newUser(userRequested.email, userRequested.password, userRequested.name, userRequested.genre, userRequested.image, userRequested.birthday,
            function (err, userId) {
                if (err) {
                    next(err)
                } else if (userId > 0) {
                    response.status(200)
                    request.session.currentUser = {id: userId, points: 0}
                    
                    response.redirect('/user/profile/'+userId)
                } else {
                    response.status(400)
                    response.setFlash("Check fields, and retry")
                    response.rendirect("/login/register")
                }
            })
    }
}

module.exports = {
    loadLoginPage: loadLoginPage,
    loadRegisterPage: loadRegisterPage,
    isUserCorrect: isUserCorrect,
    newUser: newUser
};
