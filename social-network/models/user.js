
class DAOUsers{

    constructor(pool){
        this.pool = pool
    }

    isUserCorrect(email, password, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err)
            }else{
                let sql = "SELECT * FROM users WHERE email = ? AND password = ?"
                let param = [email, password]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(err)
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
                callback(err)
            }else{
                let sql = "INSERT INTO users (email, password, name, genre, birthday, image) "+
                "VALUES (?, ?,?, ?, ?, ?)"
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

    getFriendshipRequests(userId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err)
            }else{

                let sql = "SELECT users.* FROM users JOIN friendshiprequests " +
                "ON users.userId = friendshiprequests.userRequester " +
                "WHERE friendshiprequests.userRequested = ?"
                let param = [userId]

                connection.query(sql, param, function (err, result) {
                    connection.release()

                    if(err){
                        console.log(err)
                        callback(new Error("Error de acceso a la base de datos"))
                    }
                    else{
                        let friendshipRequestsList = []
                        if(result.length == 0){
                            callback(null, friendshipRequestsList)
                        }else{
                            result.forEach(user => {
                                friendshipRequestsList.push({
                                    id: user.userId,
                                    email: user.email,
                                    password: user.password,
                                    name: user.name,
                                    genre: user.genre,
                                    birthday: user.birthday,
                                    image: user.image
                                })
                            })
                            callback(null, friendshipRequestsList)
                        }
                    }
                })
            }
        })
    }

    newRequestFriend(userId, userRequested, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err)
            }else{

                let sql = "INSERT INTO friendshiprequests(userRequester, userRequested) "+
                "VALUES (?, ?)"
                let param = [userId, userRequested]

                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(err)
                    }else if(result.affectedRows > 0){
                        callback(null, true)
                    }else{
                        callback(null, false)
                    }
                })
            }
        })
    }

    denieFriendshipRequest(userId, userRequester, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err)
            }else{                
                let sql = "DELETE FROM friendshiprequests "+
                "WHERE userRequester = ? && userRequested = ?"
                let param1 = [userRequester, userId]
                
                connection.query(sql, param1, function (err, result) {

                    if(err){
                        callback(err)
                    }
                    else{
                        if(result.affectedRows == 0){
                            callback(new Error("No existe el usuario"))
                        }else{
                            if(err){
                                callback(err)
                            }else if(result.affectedRows > 0){
                                callback(null, true)
                            }else{
                                callback(new Error("Base de datos no consistente"))
                            }
                        }
                    }
                })
            }
        })
    }

    acceptFriendsRequest(userId, userRequester, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err)
            }else{                
                let sql = "DELETE FROM friendshiprequests "+
                "WHERE userRequester = ? && userRequested = ?"
                let param1 = [userRequester, userId]
                let param2 = [userId, userRequester]

                connection.query(sql, param1, function (err, result) {

                    if(err){
                        callback(err)
                    }
                    else{
                        if(result.affectedRows == 0){
                            callback(new Error("No existe el usuario"))
                        }else{
                            connection.query(sql, param2, function (err, result) {
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
                            })
                        }
                    }
                })
            }
        })
    }

    modifyUser(email, password, name, genre, image, birthday, userId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err)
            }else{
                let sql = "UPDATE users SET email = ?, password = ?, name = ?, genre = ?, birthday = ?, image = ? where userId = ?"
                let param = [email, password, name, genre, birthday, image, userId]

                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(err)
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
                callback(err)
            }else{
                let sql = "SELECT * FROM users WHERE userId = ?"
                let param = [userId]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(err)
                    }else if(result.length > 0){
                        callback(null, result[0])
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
                callback(err)
            }else{

                let sql = "SELECT users.* FROM users JOIN friendships " +
                "ON users.userId = friendships.friendId " +
                "WHERE friendships.userId = ?"
                let param = [userId]

                connection.query(sql, param, function (err, result) {
                    connection.release()

                    if(err){
                        callback(err)
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

    getUsersByName(name, idUserLogin, callback){

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err)
            }else{
                //Seria mejor usar un JOIN, sin embargo, no hemos conseguido implementarlo correctamente.
                let sql = "SELECT users.* FROM users "+ 
                "WHERE users.userId != ? AND users.name LIKE ? "+
                    "AND users.userId NOT IN "+
                    "(SELECT friendships.friendId from friendships WHERE friendships.userId = ?) "+
                "AND users.userId NOT IN "+
                    "(SELECT friendshiprequests.userRequested "+
                    "from friendshiprequests WHERE friendshiprequests.userRequester = ?)"
                let param = [idUserLogin, '%' + name + '%', idUserLogin, idUserLogin]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(err)
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

    getUserImage(id, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err)
            }else{
                let sql = "SELECT image FROM users WHERE userId = ?"
                let param = [id]
                connection.query(sql, param, function (err, result) {
                    connection.release()
                    if(err){
                        callback(err)
                    }
                    else{
                        if(result[0].image == null){
                            callback(null, null)
                        }
                        else{
                            callback(null, result[0].image)
                        }
                    }
                })
            }
        })
    }

}

module.exports = DAOUsers;
