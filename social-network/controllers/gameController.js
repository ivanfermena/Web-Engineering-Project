"use strict";

const mysql = require('mysql')
const path = require('path')

const config = require('../config.js')
const daoGame = new require('./../models/game')

const pool = mysql.createPool(config.mysqlConfig)

const DaoGame = new daoGame(pool)

function randomQuestions(request, response) {
    response.status(200)

    DaoGame.getRandomQuestions(
        function (err, questionsList) {
            if (err) {
                next(err)
            } else if (questionsList.length >= 1) {
                response.status(200)
                response.render("game/random", { questionsList: questionsList })
            } else {
                response.status(401)
                response.render("users/profile")
            }
        })
}

function loadNewQuestion(request, response) {
    response.status(200)
    response.render("game/new_question")
}

function loadQuestion(request, response) {
    response.status(200)
    response.render("game/question")
}

function loadAnswer(request, response) {
    response.status(200)
    response.render("game/answer")
}

function newQuestion(request, response) {

    // He dictado que tiene que poner 4 las respuestas obligatoriamente
    if (request.body.new_question == '' || request.body.new_answer_1 == '' || request.body.new_answer_2 == '' ||
        request.body.new_answer_3 == '' || request.body.new_answer_4 == '') {
        response.status(400)
        response.setFlash("Some field not filled")
        response.redirect("/game/random")
    }
    else {
        let gameRequested = {
            question: request.body.new_question,
            answers: [request.body.new_answer_1,
                        request.body.new_answer_2,
                        request.body.new_answer_3,
                        request.body.new_answer_4]
        }
        
        DaoGame.newQuestion(gameRequested.question,
            function (err, questionId) {
                if (err) {
                    next(err)
                } else if (questionId >= 0) {
                    gameRequested.answers.forEach(answer => {
                        DaoGame.newAnswer(questionId, answer,
                            function (err, answerId) {
                                console.log("ID:" + answerId)
                                if (err) {
                                    next(err)
                                } else {
                                    response.status(200)
                                    response.redirect("/game/random")
                                }
                            }
                        )
                    });
                    
                } else {
                    response.status(400)
                    response.setFlash("Check fields, and retry")
                    response.redirect("/game/random")
                }
            })
    }
}

module.exports = {
    randomQuestions: randomQuestions,
    loadNewQuestion: loadNewQuestion,
    newQuestion: newQuestion,
    loadAnswer: loadAnswer,
    loadQuestion: loadQuestion
}