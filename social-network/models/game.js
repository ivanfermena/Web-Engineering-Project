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

                let sql = "INSERT INTO answers (questionId, text, isUserAnswer) " + 
                "VALUES (?, ?, ?)"
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

    getQuestionAnswers(questionId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "SELECT answers.* " +
                "FROM answers JOIN questions ON answers.questionId = questions.questionId " + 
                "WHERE questions.questionId = ? AND answers.isUserAnswer = 0"
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
                let sql = "SELECT * FROM questions WHERE questionId = ?"
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

    isQuestionAnswered(userId, questionId, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                console.log(err)
                callback(new Error("Error de conexión con la base de datos"), null)
            }
            else {
                let sql = "SELECT COUNT(answers.questionId), answers.text AS response FROM "+
                "answers JOIN usersresponses ON answers.answerId = usersresponses.answerId "+
                "WHERE usersresponses.userId = ? AND answers.questionId = ?"
                let params = [userId, questionId]
                connection.query(sql, params, function(err,result){
                    if(err){
                        console.log(err)
                        callback(new Error("Error en la consulta"), null)
                    }
                    else if(result > 0){
                        callback(null, result)
                    }
                    else {
                        callback(null, false)
                    }
                })
            }

        })
    }
}

module.exports = DAOGame;
