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
                response.render("game/random", {userId: request.session.currentUser,
                    questionsList: questionsList })
            } else {
                response.status(200)
                response.setFlash("No questions have been added yet.")
                response.render("game/random", {userId: request.session.currentUser,
                    questionsList: questionsList })
            }
        })
}

function loadNewQuestion(request, response) {
    response.status(200)
    response.render("game/new_question")
}

function loadQuestion(request, response) {

    if (request.params.questionId === undefined) {
        response.status(400)
        response.setFlash("Question not specified")
        response.render("game/random", {userId: request.session.currentUser})
    }
    else{
        DaoGame.getQuestion(request.params.questionId,
            function (err, question) {
                if (err) {
                    console.log(err)
                    next(err)
                } else if (question.text != "") {
                    response.status(200)
                    response.render("game/question", { userId: request.session.currentUser, question : question })
                } else {
                    response.status(401)
                    response.render("game/random", {userId: request.session.currentUser})
                }
            })
    }
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
                        DaoGame.newAnswer(questionId, answer, 0,
                            function (err, answerId) {
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

function loadAnswer(request, response) {

    if (request.params.questionId === undefined) {
        response.status(400)
        //TODO configurar flash
        response.setFlash("Question not specified")
        response.render("game/random")
    }
    else{
        DaoGame.getQuestionWithAnswers(request.params.questionId,
            function (err, questionWithAnswer) {
                if (err) {
                    next(err)
                } else if (questionWithAnswer[0].questionText != "" && questionWithAnswer.length >= 1) {
                    response.status(200)
                    response.render("game/answer", { answersList : questionWithAnswer })
                } else {
                    response.status(401)
                    response.render("game/random")
                }
            })
    }
}

function saveAnswer(request, response){

    if (request.body.answers === undefined) {
        response.status(400)
        response.setFlash("Answers id not specified")
        response.render("game/random")
    }
    else {
        let userId = request.session.currentUser
        let questionId = request.params.questionId
        let answerId = request.body.answers

        if(answerId === "other"){
            DaoGame.newAnswer(questionId, request.body.textNewAnswer, 1,
                function (err, id) {
                    if (err) {
                        next(err)
                    } else {
                        response.status(200)
                        DaoGame.insertAnswer(userId, id, 
                            function (err, control) {
                                if (err) {
                                    next(err)
                                } else if (control) {
                                    response.status(200)
                                    response.redirect("/game/random")
                                } else {
                                    response.status(400)
                                    response.setFlash("Answer cannot be accepted")
                                    response.redirect(`/game/random`)
                                }
                            }
                        )
                    }
                }
            )
        }else{
            DaoGame.insertAnswer(userId, answerId, 
                function (err, control) {
                    if (err) {
                        next(err)
                    } else if (control) {
                        response.status(200)
                        response.redirect("/game/random")
                    } else {
                        response.status(400)
                        response.setFlash("Answer cannot be accepted")
                        response.redirect(`/game/random`)
                    }
                }
            )
        }
 
    }
    
}

function loadAnswer(request, response) {

    if (request.params.questionId === undefined) {
        response.status(400)
        //TODO configurar flash
        response.setFlash("Question not specified")
        response.render("game/random")
    }
    else{
        DaoGame.getQuestionWithAnswers(request.params.questionId,
            function (err, answerList) {
                if (err) {
                    next(err)
                } else if (answerList[0].questionText != "" && answerList.length >= 1) {
                    response.status(200)
                    response.render("game/answer", { answersList : answerList })
                } else {
                    response.status(401)
                    response.render("game/random")
                }
            })
        }
}

module.exports = {
    randomQuestions: randomQuestions,
    loadNewQuestion: loadNewQuestion,
    newQuestion: newQuestion,
    loadAnswer: loadAnswer,
    loadQuestion: loadQuestion,
    saveAnswer: saveAnswer
}