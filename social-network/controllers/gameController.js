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
                response.render("game/random", {
                    userId: request.session.currentUser,
                    questionsList: questionsList
                })
            } else {
                response.status(200)
                response.setFlash("No questions have been added yet.")
                response.render("game/random", {
                    userId: request.session.currentUser,
                    questionsList: questionsList
                })
            }
        })
}

function loadNewQuestion(request, response) {
    response.status(200)
    response.render("game/new_question", { userId: request.session.currentUser })
}

function loadQuestion(request, response) {
    let questionId = request.params.questionId
    if (questionId === undefined) {
        response.status(400)
        response.setFlash("Question not specified")
        response.render("game/random", { userId: request.session.currentUser })
    }
    else {
        DaoGame.getQuestion(questionId,
            function (err, question) {
                if (err) {
                    console.log(err)
                    next(err)
                } else if (question.text != "") {
                    DaoGame.getUserAnswer(request.session.currentUser, questionId, function (err, answer) {
                        if (err) {
                            next(err)
                        }
                        else {
                            response.status(200)
                            let answerText = undefined
                            if (answer) {
                                answerText = answer.text
                            }
                            else {
                                answerText = "No has contestado la pregunta aún."
                            }
                            let userId = request.session.currentUser
                            DaoGame.getFriendsAnswers(questionId, userId, function (err, friendsAnswers) {
                                if (err) {
                                    next(err)
                                }
                                else if (friendsAnswers.length > 0) {
                                    DaoGame.getUserGuesses(userId, function (err, userGuesses) {
                                        if (err) {
                                            next(err)
                                        }
                                        else {
                                            
                                            let friends = []
                                            friendsAnswers.forEach(response => {
                                                let friend = { name: response.friend, id: response.friendId }
                                                let g = userGuesses.filter(guess => 
                                                    guess.responseId === response.resId    
                                                )
                                                if (g.length == 0) {
                                                    friend.guess = null
                                                    friend.resId = response.resId
                                                }
                                                
                                                else if (g[0].correct) {
                                                    friend.guess = true
                                                }
                                                else {
                                                    friend.guess = false
                                                }

                                                friends.push(friend)
                                            })
                                            response.status(200)
                                            
                                            response.render("game/question", {
                                                userId: request.session.currentUser,
                                                question: question,
                                                answer: answerText,
                                                friends: friends
                                            })
                                        }
                                    })
                                }
                                else {
                                    response.render("game/question", {
                                        userId: request.session.currentUser,
                                        question: question,
                                        answer: answerText,
                                        friends: []
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    response.status(400)
                    response.setFlash("This question has errors, please, select another one.")
                    response.render("game/random", { userId: request.session.currentUser })
                }
            })
    }
}

function newQuestion(request, response) {


    if (request.body.new_question == '' || request.body.new_answer_1 == '' || request.body.new_answer_2 == '' ||
        request.body.new_answer_3 == '' || request.body.new_answer_4 == '') {
        response.status(400)
        response.setFlash("Some field not filled")
        response.redirect("/game/new_question")
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
                    const isUserAnswer = 0
                    gameRequested.answers.forEach(answer => {
                        DaoGame.newAnswer(questionId, answer, isUserAnswer,
                            function (err) {
                                if (err) { next(err) }
                            }
                        )
                    });
                    response.status(200)
                    response.redirect("/game/random")
                } else {
                    response.status(400)
                    response.setFlash("Check fields, and retry")
                    response.redirect("/game/random")
                }
            })
    }
}

function saveAnswer(request, response) {

    if (request.body.answers === undefined) {
        response.status(400)
        response.setFlash("Answers id not specified")
        response.redirect("game/random")
    }
    else {
        let userId = request.session.currentUser
        let questionId = request.params.questionId
        let answerId = request.body.answers

        if (answerId === "other") {
            const isUserAnswer = 1
            DaoGame.newAnswer(questionId, request.body.textNewAnswer, isUserAnswer,
                function (err, id) {
                    if (err) {
                        next(err)
                    } else {
                        //Esto es importante pq en este momento answerId == 'other'
                        answerId = id
                        DaoGame.getUserAnswer(userId, questionId, function (err, lastAnswer) {
                            if (err) {
                                next(err)
                            }
                            else if (lastAnswer) {
                                DaoGame.modifyAnswer(userId, lastAnswer.answerId, answerId, function (err, inserted) {
                                    if (err) {
                                        next(err)
                                    } else if (inserted) {
                                        response.status(200)
                                        response.redirect("/game/question/" + questionId)
                                    } else {
                                        response.status(400)
                                        response.setFlash("Answer cannot be accepted")
                                        response.redirect("/game/question/" + questionId)
                                    }
                                })
                            }
                            else {

                                DaoGame.insertAnswer(userId, answerId,
                                    function (err, inserted) {
                                        if (err) {
                                            next(err)
                                        } else if (inserted) {
                                            response.status(200)
                                            response.redirect("/game/question/" + questionId)
                                        } else {
                                            response.status(400)
                                            response.setFlash("Answer cannot be accepted")
                                            response.redirect("/game/question/" + questionId)
                                        }
                                    }
                                )
                            }

                        })
                    }
                }
            )
        }
        else {

            DaoGame.getUserAnswer(userId, questionId, function (err, lastAnswer) {
                if (err) {
                    next(err)
                }
                else if (lastAnswer) {
                    DaoGame.modifyAnswer(userId, lastAnswer.answerId, answerId, function (err, inserted) {
                        if (err) {
                            next(err)
                        } else if (inserted) {
                            response.status(200)
                            response.redirect("/game/question/" + questionId)
                        } else {
                            response.status(400)
                            response.setFlash("Answer cannot be accepted")
                            response.redirect("/game/question/" + questionId)
                        }
                    })
                }
                else {
                    DaoGame.insertAnswer(userId, answerId,
                        function (err, inserted) {
                            if (err) {
                                next(err)
                            } else if (inserted) {
                                response.status(200)
                                response.redirect("/game/question/" + questionId)
                            } else {
                                response.status(400)
                                response.setFlash("Answer cannot be accepted")
                                response.redirect("/game/question/" + questionId)
                            }
                        }
                    )
                }

            })
        }
    }
}
function loadAnswer(request, response) {
    let questionId = request.params.questionId
    if (questionId === undefined) {
        response.status(400)
        response.setFlash("Question not specified")
        response.redirect("game/random")
    }
    else {
        DaoGame.getQuestion(questionId, function (err, question) {
            if (err) {
                next(err)
            }
            else {
                DaoGame.getQuestionAnswers(questionId,
                    function (err, answerList) {
                        console.log(answerList)
                        if (err) {
                            next(err)
                        } else if (answerList.length > 0) {
                            response.status(200)
                            response.render("game/answer", {
                                userId: request.session.currentUser, question: question,
                                answersList: answerList
                            })
                        }
                        else {
                            response.status(200)
                            response.setFlash("No answers created for this question yet.")
                            response.render("game/answer", {
                                userId: request.session.currentUser, question: question,
                                answersList: answerList
                            })
                        }
                    })
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