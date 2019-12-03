"use strict";

const express = require('express')
const path = require('path')
const mysql = require('mysql')
const bodyParser = require("body-parser")

const app = express()

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

// SESSION (CONFIG??)

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

app.use(middlewareSession); 

// ROOT
app.get("/", function (request, response) {
    response.status(200)
    response.redirect("/login")
})

// LOGIN
const loginRouter = require("./routers/loginRouter")
app.use("/login", loginRouter)

// REGISTER
const userRouter = require("./routers/userRouter")
app.use("/user", userRouter)

// ----- TODO -----

app.get("/answer", function (request, response) {
    response.render("answer")
})

app.get("/question", function (request, response) {
    response.render("question")
})

app.get("/random", function (request, response) {
    response.render("random");
});

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
