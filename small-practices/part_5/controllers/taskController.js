"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoTask = new require('./../models/task')

const pool = mysql.createPool(config.mysqlConfig)

const daoTask = new daoTask(pool)


function getAllTasks(request, response, next){
    daoTasks.getAllTasks(userEmail, function (err, tasks){
        if(err){
            next(err);
        }
        else {
            response.status(200)
            response.render("tasks", {taskList: tasks});   
        }
    })
}

function addTask(request, response, next){
    daoTasks.insertTask(userEmail, utils.createTask(request.body.task), function(err, msg){
        if(err){
            next(err);
        }
        else{
            response.status(200)
            response.redirect("/tasks")
        }
    })
}

function finishTask(request, response, next){
    daoTasks.markTaskDone(request.params.id, function(err){
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
    daoTasks.deleteCompleted(userEmail, function(err){
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