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

        DaoUser.newUser(user_email, userRequested.password, userRequested.name,userRequested.genre, userRequested.img, userRequested.birthday, 
            function (err, user) {
                if (err) {
                    next(err)
                }else if(user){
                    response.status(200)
                    request.session.currentUser = user_email
                    response.redirect(`/user/profile`)
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

function getUser(request, response, next) {
    
    if (request.session.currentUser != undefined){

        let user_email = request.session.currentUser

        DaoUser.getUser(user_email,
            function (err, user) {
                if (err) {
                    next(err)
                }else if(user){
                    response.status(200)
                    request.session.currentUser = user_email
                    response.render(`users/profile`, {userInfo: user[0]})
                }else {
                    response.status(401)
                    response.render("/login")
                }
            })

    }
    else {
        response.status(400)
        response.redirect("/login")
    }

}

module.exports = {
    newUser: newUser,
    getUser: getUser
};