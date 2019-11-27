"use strict";

const express = require('express')
const path = require('path')
const mysql = require('mysql')
const bodyParser = require("body-parser")
const config = require('./config.js')

const pool = mysql.createPool(config.mysqlConfig)
const daoUser = new require('./models/user')

const DaoUser = new daoUser(pool)

const app = express()

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))

// Routers -> Controllers -> Services(Moleds) -> Database

// Asi se pondrian los middlewares y despues el controler
// app.use(require('./routers/users'))
// app.use(require('./controllers'))

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", function (request, response) {
    response.status(200)
    response.redirect("/login")
})

// LOGIN
app.get("/login", function (request, response) {
    response.status(200)
    response.render("users/login")
})

//TODO comprobacion de formato email
app.post("/users/login", function (request, response, next) {
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

// REGISTER
app.get("/register", function (request, response) {
    response.status(200)
    response.render("users/register");
});

app.post("/users/register", function(request, response, next){

    console.log("CALIPO")
    
    if (request.body.user_email != undefined && request.body.user_password != undefined
        && request.body.user_name != undefined && request.body.user_genre != undefined
        && request.body.user_img != undefined && request.body.user_birthday != undefined) {

        let userRequested = {
            email: request.body.user_email,
            password: request.body.user_password,
            name: request.body.user_name,
            genre: request.body.user_genre,
            img: request.body.user_img,
            birthday: request.body.user_birthday
        }

        DaoUser.newUser(userRequested.email, userRequested.password, userRequested.name,
            userRequested.genre, userRequested.img, userRequested.birthday, 
            function (err, user) {
                if (err) {
                    next(err)
                }else if(user){
                    response.status(200)
                    response.redirect(`/users/${userRequested.email}`)
                }else {
                    response.status(401)
                    response.redirect("/users/register")
                }
            })
    }
    else {
        response.status(400)
        response.end("field not filled")
    }
})

app.get("/users:email", function (request, response) {
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


app.get("users/search", function (request, response) {
    if (request.query.name != undefined){
        let name = request.query.name
        DaoUser.getUsers(name,function(err, users){
            if(err){
                next(err)
            }
            else{
                users = users.map(user => {
                    return {
                        id: user.id,
                        name: user.name,
                        image: user.image
                    }
                })
                response.status(200)
                response.render("search", {query: name, users: users})
            }
        })
    }
    
});

app.post("search", function(request, response,next){
    if (request.body.friendId != undefined){
        let friend = request.body.friendId
        DaoUser.createFriendshipRequest(userId, friend)
    }
    else {
        response.status(400)
        response.end("Field friendId not found")
    }
})

app.use(function(request, response){
    response.status(404);
    response.render("general/404");
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
