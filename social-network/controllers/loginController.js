"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoUser = require('./../models/user')

const pool = mysql.createPool(config.mysqlConfig)

const DaoUser = new daoUser(pool)

function loadLoginPage(request, response) {
    response.status(200)
    response.render("login/login")
}

function loadRegisterPage(request, response) {
    response.status(200)
    response.render("login/register");
}

function isUserCorrect(request, response, next) {
    if (request.body.user_email == '' || request.body.user_password == '') {
        response.status(400)
        response.setFlash("Email or password field not filled")
        response.redirect("/login")
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
                request.session.currentUser = userId
                response.redirect("user/profile")
            }
        })

    }
}

function newUser(request, response, next) {

    if (request.body.user_email == '' || request.body.user_password == '' || request.body.user_name == '' ||
        request.body.user_genre == '' || request.body.user_birthday == '') {
        response.status(400)
        response.setFlash("Some field not filled")
        response.redirect("users/register")
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
                } else if (userId >= 0) {
                    response.status(200)
                    request.session.currentUser = userId
                    response.redirect(`/user/profile`)
                } else {
                    response.status(400)
                    response.setFlash("Check fields, and retry")
                    response.render("users/register")
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
