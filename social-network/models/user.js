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
                let sql = "SELECT * FROM users WHERE email = ? AND password = ?"
                let param = [email, password]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }else if(result != undefined){
                        callback(null, result[0].userId)
                    }else if(result != undefined){
                        callback(null, -1)
                    }else{
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }   

    newUser(email, password, name, genre, image, birthday, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "INSERT INTO users (userId, email, password, genre, birthday, image) VALUES (NULL, ?, ?, ?, ?, ?, ?)"
                let param = [email, password, name, genre, birthday, image]

                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }else if(result.affectedRows > 0){
                        console.log(result.insertId)
                        callback(null, result.insertId)
                    }else{
                        callback(new Error("Base de datos no consistente"))
                    }
                })
            }
        })
    }

    modifyUser(email, password, name, genre, image, birthday, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "UPDATE users SET email = ?, password = ?, name = ?, genre = ?, birthday = ?, image = ? where email = ?"
                let param = [email, password, name, genre, birthday, image, email]

                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
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

    getUser(userId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT * FROM users WHERE userId = ?"
                let param = [userId]
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

    getFriends(userId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT * FROM friendships WHERE userId = ? "
                let param = [userId]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        if(result.length == 0){
                            callback(new Error("No existe el usuario"))
                        }else{
                            let users = []
                            result.forEach(id => {users.push(module.exports.getUser(userId, callback))})
                            console.log(users)
                            callback(null, users)
                        }
                    }
                })
            }
        })
    }

    getUsersByName(email, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT * FROM users WHERE email LIKE ?"
                let param = ['%' + email + '%']
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        if(result.length == 0){
                            callback(new Error("No existe el usuario"))
                        }else{
                            let users = []
                            result.forEach(user => {
                                users.push({
                                    id: user.userId,
                                    email: user.email,
                                    password: user.password,
                                    email: user.email,
                                    genre: user.genre,
                                    birthday: user.birthday,
                                    image: user.image
                                })
                            })
                            callback(null, users)
                        }
                    }
                })
            }
        })
    }
}

module.exports = DAOUsers;
