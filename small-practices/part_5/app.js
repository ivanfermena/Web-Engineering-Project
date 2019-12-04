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
const taskRouter = require("./routers/taskRouter")
const userRouter = require("./routers/userRouter")
const app = express()

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(middlewareSession)
app.use(flashMiddleware)

app.get("/", function (request, response) {
    response.status(200)
    response.redirect("/login")
})

app.use("/login", loginRouter)

app.use(function (request, response, next) {
    if (request.session.currentUser === undefined) {
        response.status(401)
        response.setFlash("Forbidden access, please login")
        response.redirect("/login")
    }

    else {
        response.locals.userEmail = request.session.currentUser
        next()
    }
})

app.use("/tasks", taskRouter)

app.use("/imagenUsuario", userRouter)

app.get("/logout", function (request, response) {
    request.session.destroy(function (err) {
        if (err) {
            next(err)
        }
        else {
            response.redirect("/")
        }
    })
})

app.use(function (request, response) {
    response.status(404);
    response.render("general/404");
})

app.use(function (error, request, response, next) {
    // Código 500: Internal server error   
    console.log(error)
    response.status(500);
    response.render("login", { errorMsg: "algo ha fallado" });
})

// APP Listen
app.listen(3000, (err) => {
    if (err) console.log(err);
    else console.log("Server listen: localhost:3000");
})

function flashMiddleware(request, response, next) {
    response.setFlash = function (msg) {
        request.session.flashMsg = msg;
    };
    response.locals.getAndClearFlash = function () {
        if (request.session.flashMsg === undefined){
            return null
        }
        else{
            let msg = request.session.flashMsg
            delete request.session.flashMsg
            return msg
        }
        
    }
    next()
}
