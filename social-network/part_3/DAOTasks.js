const mysql = require("mysql")

class DAOTasks{

    constructor(pool){
        this.pool = pool
    }

    getAllTasks(email, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT task.id as id, task.text as text, task.done as done, tag.tag as tag " +
                          "FROM task JOIN user ON user.email = task.user " + 
                          "JOIN tag ON tag.taskId = task.id " + 
                          "WHERE user.email = ?"
                let param = [email]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    let arr = []
                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else {
                        console.log(result)
                        anterior = result[0].id
                        result.forEach(fila => {
                            console.log(fila.id)
                            if(anterior != fila.id){
                                let obj = {}
                                obj.tags = []
                                obj.id = fila.id
                                obj.text = fila.text
                                obj.done = fila.done
                                arr.push(obj)
                            }
                            
                            obj.tags.push(fila.tag)
                            
                        });
                        callback(null, arr)
                    }
                })
            }
        })
    }

    insertTask(email, task, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback("Error de conexión a la base de datos")
            }else{

                // Primera consulta para la tabla task

                let sqlTask = "INSERT INTO task VALUES (?,?,?,?)"
                let paramTask = [, email, task.text, task.done]
                connection.query(sqlTask, paramTask, function (err, result) {
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }else{
                        
                        // Segunda consulta para la tabla tags
                        let sqlTag = "INSERT INTO tag VALUES "

                        for (let i = 0; i < task.tags.length; i++) {
                            sqlTag = sqlTag.concat("(?,?),")
                        }

                        sqlTag = sqlTag.substring(0, sqlTag.length - 1);
                        
                        let paramTag = []
                        task.tags.forEach(element => {
                            paramTag.push(result.insertId)  
                            paramTag.push(element)    
                        });

                        connection.query(sqlTag, paramTag, function (err, resultTag) {
                            connection.release()
                            if(err){
                                console.log(err)
                                callback(new Error("Error de acceso a la base de datos"))
                            }else{
                                callback("Introduccido correctamente")
                            }
                        })
                    }
                })
            }
        })
    }

    markTaskDone(idTask, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback("Error de conexión a la base de datos")
            }else{
                let sql = "UPDATE task SET done = 1 WHERE id = ? "
                let param = [idTask]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }else {
                        callback(true)
                    }
                })
            }
        })
    }

    deleteCompleted(email, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback("Error de conexión a la base de datos")
            }else{
                let sql = "DELETE FROM task WHERE user = ? AND done = 1"
                let param = [email]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }else {
                        callback(true)
                    }
                })
            }
        })
    }
}

module.exports = DAOTasks;