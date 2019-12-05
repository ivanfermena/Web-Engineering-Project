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
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }else if(result.length >= 1){
                        callback(null, result[0].userId)
                    }else if(result.length == 0){
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
                //TODO aqui hay que pasar birthday a formato yyyy-mm-dd por requisito de mysql
                let sql = "INSERT INTO users (email, password, name, genre, birthday, image) VALUES (?, ?,?, ?, ?, ?)"
                let param = [email, password, name, genre, birthday, image]
                
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

    getFriendsRequest(userId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "SELECT * FROM users WHERE userId IN (SELECT userRequester FROM friendshiprequests where userRequested = ?)"
                let param = [userId]

                connection.query(sql, param, function (err, result) {
                    connection.release()

                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        let requestFriendsList = []
                        if(result.length == 0){
                            callback(null, requestFriendsList)
                        }else{
                            result.forEach(user => {
                                requestFriendsList.push({
                                    id: user.userId,
                                    email: user.email,
                                    password: user.password,
                                    name: user.name,
                                    genre: user.genre,
                                    birthday: user.birthday,
                                    image: user.image
                                })
                            })
                            callback(null, requestFriendsList)
                        }
                    }
                })
            }
        })
    }

    newRequestFriend(userId, userRequester, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "INSERT INTO friendshiprequests (userRequester, userRequested) VALUES (?, ?)"
                let param = [userId, userRequester]

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

    deniedFriendsRequest(userId, userRequester, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "DELETE FROM friendshiprequests WHERE userRequester = ? && userRequested = ?"
                let param = [userRequester, userId]

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

    acceptFriendsRequest(userId, userRequester, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{

                let sql = "DELETE FROM friendshiprequests WHERE userRequester = ? && userRequested = ?"
                let param = [userRequester, userId]

                connection.query(sql, param, function (err, result) {

                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        if(result.affectedRows == 0){
                            callback(new Error("No existe el usuario"))
                        }else{
                            
                            let sqlInsert = "INSERT INTO friendships (userId, friendId) VALUES (?, ?),(?, ?)"
                            let paramInsert = [userRequester, userId, userId, userRequester]

                            connection.query(sqlInsert, paramInsert, function (err, result) {
                                connection.release()

                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"))
                                }else if(result.affectedRows > 0){
                                    callback(null, userId)
                                }else{
                                    callback(new Error("Base de datos no consistente"))
                                }
                            })
                        }
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
                        console.log(result)
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

                let sql = "SELECT * FROM users WHERE userId IN (SELECT friendId FROM friendships where userId = ?)"
                let param = [userId]

                connection.query(sql, param, function (err, result) {
                    connection.release()

                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        let friendsList = []
                        if(result.length == 0){
                            callback(null, friendsList)
                        }else{
                            
                            result.forEach(user => {
                                friendsList.push({
                                    id: user.userId,
                                    email: user.email,
                                    password: user.password,
                                    name: user.name,
                                    genre: user.genre,
                                    birthday: user.birthday,
                                    image: user.image
                                })
                            })
                            callback(null, friendsList)
                        }
                    }
                })
            }
        })
    }

    getUsersByName(name, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT * FROM users WHERE name LIKE ?"
                let param = ['%' + name + '%']
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        let users = []
                        if(result.length == 0){
                            callback(null, users)
                        }else{
                            result.forEach(user => {
                                users.push({
                                    id: user.userId,
                                    email: user.email,
                                    password: user.password,
                                    name: user.name,
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

    getUserImageName(id, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            }else{
                let sql = "SELECT img FROM user WHERE userId = ?"
                let param = [id]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        console.log("reccc")
                        console.log(result[0].img)
                        if(result[0].img == ''){
                            callback(null, null)
                        }else{
                            callback(null, result[0].img)
                        }
                    }
                })
            }
        })
    }

}

module.exports = DAOUsers;
