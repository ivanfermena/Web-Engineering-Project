"use strict";

const mysql = require('mysql')
const path = require("path")

const config = require('../config.js')
const daoUser = require('./../models/user')

const pool = mysql.createPool(config.mysqlConfig)

const DaoUser = new daoUser(pool)

function getUserImageName(req, res, next){
    if(res.locals.userEmail === undefined){
        res.status(401)
        res.setFlash("Forbidden access, user not identified")
        res.redirect("/login")
    }

    DaoUser.getUserImageName(res.locals.userEmail, function(err, img){
        if(err){
            console.log(err)
            next(err)
        }

        console.log(img)
        if(img === null){
            res.status(200)
            res.sendFile(path.join(__dirname, '../public/img', 'user.png'))
        }
        else {
            res.status(200)
            res.sendFile(path.join(__dirname, '../profile_imgs', img))
        }
    })
}

module.exports = {
    getUserImageName: getUserImageName
}