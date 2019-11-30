const mysql = require("mysql")

class DAOUsers{

    constructor(pool){
        this.pool = pool
    }

    isUserCorrect(email, password, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT count(*) AS ret FROM users WHERE email = ? AND password = ?"
                let param = [email, password]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }else if(result[0].ret == 0){
                        callback(null, false)
                    }else if(result[0].ret == 1){
                        callback(null, true)
                    }else{
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }   

    newUser(email, password, name, genre, img, birthday, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "INSERT INTO users (userId, email, password, name, genre, birthday, image) VALUES (NULL, ?, ?, ?, ?, ?, ?)"
                let param = [email, password, name, genre, birthday, img]
                
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
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

    getUserImageName(email, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT * FROM user WHERE email = ?"
                let param = [email]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        console.log(result)
                        if(result.length == 0){
                            callback(new Error("No existe el usuario"))
                        }else{
                            callback(null, result[0].img)
                        }
                    }
                })
            }
        })
    }

    getUser(email, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT * FROM users WHERE email = ?"
                let param = [email]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }else if(result){
                        callback(null, result)
                    }else{
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }

    getUsers(name, callback){
        /*this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT * FROM user WHERE name LIKE = ?%"
                let param = [name]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        console.log(result)
                        if(result.length == 0){
                            callback(new Error("No existe el usuario"))
                        }else{
                            users = []
                            result.forEach(user => {
                                users.push({
                                    id: user.userId,
                                    email: user.email,
                                    password = user.password,
                                    name = user.name,
                                    genre = user.genre,
                                    birthday = user.birthday,
                                    image: user.image
                                })
                            })
                            callback(null, users)
                        }
                    }
                })
            }
        })*/
    }
}

module.exports = DAOUsers;
