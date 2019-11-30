"use strict";

const express = require('express')
const path = require('path')
const mysql = require('mysql')
const bodyParser = require("body-parser")
const session = require("express-session")
const mysqlSession = require("express-mysql-session")
const MySQLStore = mysqlSession(session)
const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "tareas"
});

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});
const loginRouter = require("./routers/loginRouter")

const app = express()

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(middlewareSession)

app.use(flashMiddleware)

app.use("/login", loginRouter)

app.get("/", function (request, response) {
    response.status(200)
    response.redirect("/login")
})

app.get("/register", function (request, response) {
    response.status(200)
    response.render("users/register");
});

app.post("/users/register", function (request, response, next) {

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
                } else if (user) {
                    response.status(200)
                    response.redirect(`/users/${userRequested.email}`)
                } else {
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


app.use(function (request, response) {
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


function flashMiddleware(request, response, next) {
    response.setFlash = function (msg) { request.session.flashMsg = msg; }; 
    response.locals.getAndClearFlash = function () {
        let msg = request.session.flashMsg; delete request.session.flashMsg; return msg;
    }; 
    next();
};