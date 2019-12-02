"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoTask = require('./../models/task')
const utils = require('./../utils')

const pool = mysql.createPool(config.mysqlConfig)

const DaoTask = new daoTask(pool)


function getAllTasks(request, response, next){
    if(response.locals.userEmail === undefined){
        response.status(401)
        response.render("login", {errorMsg: "Forbidden access, user not identified"})
    }

    DaoTask.getAllTasks(response.locals.userEmail, function (err, tasks){
        if(err){
            next(err);
        }
        else {
            console.log(tasks)
            response.status(200)
            response.render("tasks", {taskList: tasks});   
        }
    })
}

function addTask(request, response, next){
    if(response.locals.userEmail === undefined){
        response.status(401)
        response.render("login", {errorMsg: "Forbidden access, user not identified"})
    }

    DaoTask.insertTask(response.locals.userEmail, utils.createTask(request.body.task), function(err, msg){
        if(err){
            next(err);
        }
        
        response.status(200)
        response.redirect("/tasks")
        
    })
}

function finishTask(request, response, next){
    if(response.locals.userEmail === undefined){
        response.status(401)
        response.render("login", {errorMsg: "Forbidden access, user not identified"})
    }
    
    DaoTask.markTaskDone(request.params.id, function(err){
        
        if(err){
            console.log(request.params.id)
            next(err);
        }
        else {
            response.status(200)
            response.redirect("/tasks")
        }
    })
}

function deleteCompleted(request, response, next){

    if(response.locals.userEmail === undefined){
        response.status(401)
        response.render("login", {errorMsg: "Forbidden access, user not identified"})
    }

    DaoTask.deleteCompleted(response.locals.userEmail, function(err){
        if(err){
            next(err)
        }
        else {
            response.status(200)
            response.redirect("/tasks")
        }
    })
}

module.exports = {
    getAllTasks: getAllTasks,
    addTask: addTask,
    finishTask: finishTask,
    deleteCompleted: deleteCompleted
}