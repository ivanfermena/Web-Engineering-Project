"use strict";

const express = require('express')

const taskRouter = express.Router()
const taskController = require("../controllers/taskController")

taskRouter.get("", taskController.getAllTasks)

taskRouter.post("/addTask", taskController.addTask)

taskRouter.get("/finish/:id", taskController.finishTask)
taskRouter.post("/deleteCompleted", taskController.deleteCompleted)

module.exports = taskRouter