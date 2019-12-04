"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoUser = new require('./../models/user')

const pool = mysql.createPool(config.mysqlConfig)

const DaoUser = new daoUser(pool)

function getPage(request, response) {
    response.status(200)
    response.render("login")
}

function isUserCorrect(request, response, next) {
    if (request.body.user_email == '' || request.body.user_password == '') {
        response.status(400)
        response.setFlash("Email or password fields not filled")
        response.redirect("/login")
    }

    let userRequested = {
        email: request.body.user_email,
        password: request.body.user_password
    }

    DaoUser.isUserCorrect(userRequested.email, userRequested.password, function (err, user) {
        console.log(user)
        if (err) {
            next(err)
        }
        else if (user) {
            response.status(200)
            request.session.currentUser = userRequested.email
            response.redirect("/tasks")
        }
        else {
            response.status(401)
            response.setFlash("Not valid email or password")
            response.redirect("/login")
        }
    })

}

module.exports = {
    getPage: getPage,
    isUserCorrect: isUserCorrect
};
