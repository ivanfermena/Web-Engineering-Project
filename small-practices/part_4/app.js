const config = require("./config");
const DAOTasks = require("./DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Crear un servidor Express.js
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))


// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoTasks = new DAOTasks(pool);

const userEmail = "gerparra@ucm.es"


app.get("/tasks", function(request, response, next){
    daoTasks.getAllTasks(userEmail, function (err, tasks){
        if(err){
            next(err);
        }
        else {
            response.status(200)
            response.render("tasks", {taskList: tasks});   
        }
    });
})

app.post("/tasks/addTask", function(request, response, next){
    daoTasks.insertTask(userEmail, utils.createTask(request.body.task), function(err, msg){
        if(err){
            next(err);
        }
        else{
            response.status(200)
            response.redirect("/tasks")
        }
    })
})

app.get("/finish/:id", function(request, response, next){
    daoTasks.markTaskDone(request.params.id, function(err){
        if(err){
            console.log("oh oh")
            console.log(request.params.id)
            next(err);
        }
        else {
            console.log("bieeen")
            response.status(200)
            response.redirect("/tasks")
        }
    })
})

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

// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
