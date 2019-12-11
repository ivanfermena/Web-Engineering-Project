"use strict";

const express = require('express')

const gameRouter = express.Router()
const controller = require("../controllers/gameController")

gameRouter.get("/random", controller.randomQuestions)

gameRouter.get("/new_question", controller.loadNewQuestion)
gameRouter.post("/new_question",controller.newQuestion)

gameRouter.get("/answer/:questionId", controller.loadAnswer)
gameRouter.post("/answer/:questionId", controller.saveAnswer)

gameRouter.get("/question/:questionId", controller.loadQuestion)

gameRouter.get("/question/:questionId/guess/:friendResId", controller.loadGuessPage)
gameRouter.post("/question/:questionId/guess/:friendResId", controller.saveGuess)

module.exports = gameRouter;