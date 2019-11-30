"use strict";

const mysql = require('mysql')

const config = require('../config.js')
const daoTask = require('./../models/task')

const pool = mysql.createPool(config.mysqlConfig)

const DaoTask = new daoTask(pool)


function getAllTasks(request, response, next){
    DaoTask.getAllTasks(request.session.currentUser, function (err, tasks){
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
    DaoTask.insertTask(userEmail, utils.createTask(request.body.task), function(err, msg){
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
    DaoTask.deleteCompleted(request.session.currentUser, function(err){
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