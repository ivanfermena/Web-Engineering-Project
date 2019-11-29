"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoUser = new require('./../models/user')

const pool = mysql.createPool(config.mysqlConfig)

const DaoUser = new daoUser(pool)

function newUser(request, response, next){

    if (request.body.user_email != undefined && request.body.user_password != undefined && request.body.user_name != undefined && 
        request.body.user_genre != undefined && request.body.user_img != undefined && request.body.user_birthday != undefined) {

        let userRequested = {
            email: request.body.user_email,
            password: request.body.user_password,
            name: request.body.user_name,
            genre: request.body.user_genre,
            img: request.body.user_img,
            birthday: request.body.user_birthday
        }

        DaoUser.newUser(userRequested.email, userRequested.password, userRequested.name,userRequested.genre, userRequested.img, userRequested.birthday, 
            function (err, user) {
                if (err) {
                    next(err)
                }else if(user){
                    response.status(200)
                    request.session.currentUser = userRequested.email
                    response.redirect(`/users/profile`)
                }else {
                    response.status(401)
                    response.redirect("/users/register")
                }
            })
    }
    else {
        response.status(400)
        response.redirect("/users/register")
    }
}

module.exports = {
    newUser: newUser
};