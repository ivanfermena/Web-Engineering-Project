"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoUser = new require('./../models/user')

const pool = mysql.createPool(config.mysqlConfig)

const DaoUser = new daoUser(pool)

function getPage(request, response) {
    response.status(200)
    response.render("login", { errorMsg: null });
}

function isUserCorrect(request, response, next) {
    if (request.body.user_email === undefined || request.body.user_password === undefined) {
        console.log("jiji")
        response.status(400)
        response.render("login", { errorMsg: "Field user or password not filled" })
    }

    let userRequested = {
        email: request.body.user_email,
        password: request.body.user_password
    }

    DaoUser.isUserCorrect(userRequested.email, userRequested.password, function (err, user) {
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
            response.render("login", { errorMsg: "Not valid email or password" })
        }
    })

}

module.exports = {
    getPage: getPage,
    isUserCorrect: isUserCorrect
};
