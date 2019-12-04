"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoUser = new require('./../models/user')

const pool = mysql.createPool(config.mysqlConfig)

const DaoUser = new daoUser(pool)

function isUserCorrect(request, response, next){

    if (request.body.user_email != undefined && request.body.user_password != undefined) {
        
        let userRequested = {
            email: request.body.user_email,
            password: request.body.user_password
        }

        DaoUser.isUserCorrect(userRequested.email, userRequested.password, function(err, userId){
            if(err){
                next(err)
            }
            else if(userId >= 0){
                response.status(200)
                request.session.currentUser = userId
                response.redirect("user/profile")
            }
            else {
                response.status(401)
                response.render("login")
            }
        })

    }else{
        response.status(400)
        response.render("login")
    }
}

module.exports = {
    isUserCorrect: isUserCorrect
};
