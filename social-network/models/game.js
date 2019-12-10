const mysql = require("mysql")

class DAOGame {

    constructor(pool) {
        this.pool = pool
    }

    newQuestion(question, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {

                let sql = "INSERT INTO questions (text) VALUES (?)"
                let param = [question]

                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if (err) {
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    } else if (result.affectedRows > 0) {
                        callback(null, result.insertId)
                    } else {
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }

    newAnswer(questionId, text, isUserAnswer, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {

                let sql = "INSERT INTO answers (questionId, text, isUserAnswer) " +
                    "VALUES (?, ?, ?)"
                let param = [questionId, text, isUserAnswer]

                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if (err) {
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    } else if (result.affectedRows > 0) {
                        callback(null, result.insertId)
                    } else {
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }

    getRandomQuestions(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {

                let sql = "SELECT * FROM questions ORDER BY RAND() LIMIT 5"

                connection.query(sql, function (err, result) {
                    connection.release()

                    if (err) {
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else {
                        let questionsList = []
                        if (result.length == 0) {
                            callback(null, questionsList)
                        } else {
                            result.forEach(question => {
                                questionsList.push({
                                    id: question.questionId,
                                    text: question.text
                                })
                            })
                            callback(null, questionsList)
                        }
                    }
                })
            }
        })
    }

    getQuestionAnswers(questionId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {

                let sql = "SELECT answers.* " +
                    "FROM answers JOIN questions ON answers.questionId = questions.questionId " +
                    "WHERE questions.questionId = ?"
                let param = [questionId]
                connection.query(sql, param,
                    function (err, result) {
                        connection.release()
                        if (err) {
                            console.log(err)
                            callback(new Error("Error de acceso a la base de datos"))
                        }
                        else {
                            let answerList = []
                            if (result.length == 0) {
                                callback(null, answerList)
                            } else {
                                result.forEach(answer => {
                                    answerList.push({
                                        id: answer.answerId,
                                        questionId: answer.questionId,
                                        text: answer.text,
                                        isUserAnswer: answer.isUserAnswer
                                    })
                                })
                                callback(null, answerList)
                            }
                        }
                    })
            }
        })
    }

    insertAnswer(userId, answer, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {

                let sql = "INSERT INTO usersresponses (userId, answerId) VALUES (?, ?)"
                let param = [userId, answer]

                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if (err) {
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    } else if (result.affectedRows > 0) {
                        callback(null, true)
                    } else {
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }

    getQuestion(questionId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                let sql = "SELECT * FROM questions WHERE questionId = ?"
                let param = [questionId]

                connection.query(sql, param, function (err, result) {
                    connection.release()

                    if (err) {
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    } else if (result) {
                        callback(null, result[0])
                    } else {
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }

    getUserAnswer(userId, questionId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                callback(new Error("Error de conexión con la base de datos"), null)
            }
            else {
                let sql = "SELECT COUNT(answers.questionId) AS counter, answers.text, answers.answerId " +
                    "FROM answers JOIN usersresponses ON answers.answerId = usersresponses.answerId " +
                    "WHERE usersresponses.userId = ? AND answers.questionId = ?"
                let params = [userId, questionId]
                connection.query(sql, params, function (err, result) {
                    connection.release()
                    if (err) {
                        console.log(err)
                        callback(new Error("Error en la consulta"), null)
                    }
                    else if (result[0].counter > 0) {
                        callback(null, result[0])
                    }
                    else {
                        callback(null, false)
                    }
                })
            }

        })
    }

    modifyAnswer(userId, lastAnswerId, answerId, callback) {
        this.pool.getConnection(function (err, connection) {

            if (err) {
                console.log(err)
                callback(new Error("Fallo de conexión con la BD"), null)
            }
            else {
                let sql_delete_last = "DELETE FROM usersresponses WHERE userId = ? AND answerId = ?"
                let params = [userId, lastAnswerId]
                let sql_insert_new = "INSERT INTO usersresponses(userId, answerId) VALUES(?,?)"
                connection.query(sql_delete_last, params, function (err, result) {
                    if (err) {
                        connection.release()
                        console.log(err)
                        callback(new Error("Error durante el borrado de la anterior respuesta"), null)
                    }
                    else {
                        params[1] = answerId
                        connection.query(sql_insert_new, params, function (err, result) {
                            connection.release()
                            if (err) {
                                console.log(err)
                                callback(new Error("Error durante la inserción de la nueva respuesta"), null)
                            }
                            else if (result.affectedRows > 0) {
                                callback(null, true)
                            } else {
                                callback(new Error("Base de datos no consistente"))
                            }
                        })
                    }
                })
            }
        })
    }

    getFriendsAnswers(questionId, userId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                callback(new Error("Fallo en la conexión con la BD"))
            }
            else {
                let sql_friends_answers = "SELECT usersresponses.responseId as resId, users.userId as friendId, users.name as friend " +
                    "FROM ((usersresponses JOIN friendships " +
                    "ON usersresponses.userId = friendships.friendId) " +
                    "JOIN answers ON usersresponses.answerId = answers.answerId) " +
                    "JOIN users ON usersresponses.userId = users.userId " +
                    "WHERE friendships.userId = ? AND answers.questionId = ?"
                let params = [userId, questionId]
                connection.query(sql_friends_answers, params, function (err, friendsAnswers) {
                    connection.release()
                    if (err) {
                        console.log(err)
                        callback(new Error("Fallo en la consulta a BD"))
                    }
                    else {
                        let answers = [] 
                        friendsAnswers.forEach(answer => {
                            let obj = { 
                                resId: answer.resId,
                                friendId: answer.friendId,
                                friend: answer.friend
                            }
                            answers.push(obj)
                        })
                        callback(null, answers)
                    }
                })
            }
        })
    }

    getUserGuesses(userId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                callback(new Error("Fallo en la conexión con la BD"))
            }
            else {
                let sql_get_user_guesses = "SELECT * FROM usersguesses WHERE userId = ?"
                let param = [userId]
                connection.query(sql_get_user_guesses, param, function (err, userGuesses) {
                    connection.release()
                    if (err) {
                        console.log(err)
                        callback(new Error("Fallo en la consulta a BD"))
                    }
                    else {
                        let guesses = []
                        userGuesses.map(guess => {
                            let obj = {
                                guessId: guess.guessId,
                                userId: guess.userId,
                                responseId: guess.responseId,
                                correct: guess.correct
                            }
                            guesses.push(obj)
                        })
                        callback(null, guesses)
                    }
                })
            }
        })

    }
}

module.exports = DAOGame;
