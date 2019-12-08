"use strict";

const express = require('express')
const path = require('path')
const mysql = require('mysql')
const bodyParser = require("body-parser")

const app = express()

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))

const session = require("express-session")
const mysqlSession = require("express-mysql-session")
const MySQLStore = mysqlSession(session)
const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "facefluff"  
});

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

app.use(middlewareSession) 
app.use(flashMiddleware)

// ROOT
app.get("/", function (request, response) {
    response.status(200)
    response.redirect("/login")
})

// LOGIN and REGISTER
const loginRouter = require("./routers/loginRouter")
app.use("/login", loginRouter)

// Middleware access
app.use(accessMiddleware)

const userRouter = require("./routers/userRouter")
app.use("/user", userRouter)

// Random question
const gameRouter = require("./routers/gameRouter")
app.use("/game", gameRouter)



app.use(function(request, response){
    response.status(404);
    response.render("general/404");
})

app.use(function (error, request, response, next) {
    // Código 500: Internal server error   
    console.log(error)
    response.status(500);
    response.render("general/500")
})

// APP Listen
app.listen(3000, (err) => {
    if (err) console.log(err);
    else console.log("Server listen: localhost:3000");
})

function flashMiddleware(request, response, next) {
    response.setFlash = function (msg) {
        request.session.flashMsg = msg;
        console.log(request.session.flashMsg)
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

function loadImageMiddleware(req, res, next){
    if(err){
        console.log(err)
        next(err)
    }
    
    else {
        res.status(200)
        res.sendFile(path.join(__dirname, '../public/img', req.body.img))        
    }
        
}
    
function accessMiddleware(request, response, next) {
    if (request.session.currentUser === undefined) {
        response.status(401)
        response.setFlash("Forbidden access, please login")
        response.redirect("/login")
    }

    else {
        next()
    }
}
