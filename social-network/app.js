"use strict";

const express = require('express')
const path = require('path')
const mysql = require('mysql')
const bodyParser = require("body-parser")
const config = require('./config.js')

const pool = mysql.createPool(config.mysqlConfig)
const daoUser = new require('./Models/DAOUsers')

const DaoUser = new daoUser(pool)

const app = express()

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", function (request, response) {
    response.status(200)
    response.redirect("/login")
})

app.get("/login", function (request, response) {
    response.status(200)
    response.render("login")
})

//TODO comprobacion de formato email
app.post("/login", function (request, response, next) {
    console.log(request.body.user_email)
    console.log(request.body.user_password)
    if (request.body.user_email != undefined && request.body.user_password != undefined) {
        let userRequested = {
            email: request.body.user_email,
            password: request.body.user_password
        }
        DaoUser.isUserCorrect(userRequested.email,
            userRequested.password, function (err, user) {
                console.log(user)
                if (err) {
                    next(err)
                }
                else if(user){
                    response.status(200)
                    response.redirect(`/user/${userRequested.email}`)
                }
                else {
                    response.status(401)
                    response.redirect("/login")
                }
            })
    }
    else {
        response.status(400)
        response.end("field not filled")
    }
})

app.get("/register", function (request, response) {
    response.render("register");
});

app.post("/register", function(request, response, next){
    newUser = {
        email: request.body.email,
        password: request.body.password
        //TODO seguir por aqui
    }
})

app.get("/user:email", function (request, response) {
    response.render("user");
});

app.get("/answer", function (request, response) {
    response.render("answer")
})

app.get("/friends", function (request, response) {
    response.render("friends")
})



app.get("/question", function (request, response) {
    response.render("question")
})

app.get("/random", function (request, response) {
    response.render("random");
});


app.get("/search", function (request, response) {
    response.render("search");
});


app.use(function(request, response){
    response.status(404);
    response.end();
})

app.use(function (error, request, response, next) {
    // Código 500: Internal server error   
    console.log(error)
    response.status(500);
    response.end();
})

// APP Listen
app.listen(3000, (err) => {
    if (err) console.log(err);
    else console.log("Server listen: localhost:3000");
})
