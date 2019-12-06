"use strict";

const express = require('express')

const gameRouter = express.Router()
const controller = require("../controllers/gameController")

gameRouter.get("/random", controller.randomQuestions)

gameRouter.get("/new_question", controller.loadNewQuestion)
gameRouter.post("/new_question",controller.newQuestion)

gameRouter.get("/answer", controller.loadAnswer)

gameRouter.get("/question", controller.loadQuestion)

module.exports = gameRouter;