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

    newAnswer(questionId, text, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "INSERT INTO answers (questionId, text) VALUES (?, ?)"
                let param = [questionId, text]
                
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

}

module.exports = DAOGame;
