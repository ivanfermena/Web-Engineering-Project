const mysql = require("mysql")

class DAOGame{

    constructor(pool){
        this.pool = pool
    }

    newQuestion(question, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "INSERT INTO questions (text) VALUES (?)"
                let param = [question]
                
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }else if(result.affectedRows > 0){
                        callback(null, result.insertId)
                    }else{
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }

    newAnswer(questionId, text, isUserAnswer, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "INSERT INTO answers (questionId, text, isUserAnswer) VALUES (?, ?, ?)"
                let param = [questionId, text, isUserAnswer]
                
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }else if(result.affectedRows > 0){
                        callback(null, result.insertId)
                    }else{
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }

    getRandomQuestions(callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "SELECT * FROM questions ORDER BY RAND() LIMIT 5"
                
                connection.query(sql, function (err, result) {
                    connection.release()

                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        let questionsList = []
                        if(result.length == 0){
                            callback(null,  questionsList)
                        }else{
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

    getQuestionWithAnswers(questionId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "SELECT answers.*, questions.text AS questionText " +
                "FROM answers JOIN questions ON answers.questionId = questions.questionId " + 
                "WHERE questions.questionId = ? && answers.isUserAnswer = 0";
                let param = [questionId]
                
                connection.query(sql, param, 
                    function (err, result) {
                    connection.release()

                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        let answerList = []
                        if(result.length == 0){
                            callback(null,  answerList)
                        }else{
                            result.forEach(answer => {
                                answerList.push({
                                    id: answer.answerId,
                                    questionId: answer.questionId,
                                    text: answer.text,
                                    isUserAnswer: answer.isUserAnswer,
                                    questionText: answer.questionText
                                })
                            })
                            callback(null, answerList)
                        }
                    }
                })
            }
        })
    }

    insertAnswer(userId, answerX, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "INSERT INTO usersresponses (userId, answerId) VALUES (?, ?)"
                let param = [userId, answerX]
                
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }else if(result.affectedRows > 0){
                        callback(null, true)
                    }else{
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }

    getQuestion(questionId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT * FROM `questions` WHERE questionId = ?"
                let param = [questionId]
                
                connection.query(sql, param, function (err, result) {
                    connection.release()

                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }else if(result){
                        callback(null, result[0])
                    }else{
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }


}

module.exports = DAOGame;
