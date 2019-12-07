"use strict";

const mysql = require('mysql')
const path = require('path')

const config = require('../config.js')
const daoUser = new require('./../models/user')

const pool = mysql.createPool(config.mysqlConfig)

const DaoUser = new daoUser(pool)

function loadModifyPage(request, response) {
    response.status(200)
    response.render("users/modify")
}

function getUser(request, response, next) {

    if (request.session.currentUser != undefined) {

        let userId = request.session.currentUser

        DaoUser.getUser(userId,
            function (err, user) {
                if (err) {
                    next(err)
                } else if (user) {
                    response.status(200)
                    request.session.currentUser = userId
                    response.render(`users/profile`, { userInfo: user[0] })
                } else {
                    response.status(401)
                    response.render("/login")
                }
            })

    }
    else {
        response.status(400)
        response.redirect("/login")
    }
}

function getFriends(request, response, next) {

    if (request.session.currentUser != undefined) {

        let userId = request.session.currentUser

        DaoUser.getFriends(userId,
            function (err, friendsList) {
                if (err) {
                    next(err)
                } else {
                    DaoUser.getRequestedFriends(userId,
                        function (err, requestedFriendsList) {
                            if (err) {
                                next(err)
                            } else{
                                response.status(200)
                                response.render("users/friends",
                                    {friendsList: friendsList, 
                                      requestedFriendsList: requestedFriendsList })
                            }
                        }
                    )
                }
            }
        )

    }
    else {
        response.status(400)
        response.render("users/friends")
    }
}


function acceptRequest(request, response, next) {

    if (request.params.userId === undefined) {
        response.status(400)
        //TODO configurar flash
        response.setFlash("Friend id not specified")
        response.render("users/friends")
    }
    else {
        let userRequested = request.session.currentUser
        let userRequester = request.params.userId

        DaoUser.acceptFriendsRequest(userRequested, userRequester,
            function (err, user) {
                if (err) {
                    next(err)
                } else if (user) {
                    response.status(200)
                    response.redirect(`/user/friends`)
                } else {
                    response.status(400)
                    response.setFlash("Friendship cannot be accepted")
                    response.redirect(`/user/friends`)
                }
            }
        )

    }
}

function denieRequest(request, response, next) {

    if (request.params.userId != undefined) {

        let userId = request.session.currentUser
        let userRequester = request.params.userId
        DaoUser.denieFriendshipRequest(userId, userRequester,
            function (err, user) {
                if (err) {
                    next(err)
                } else if (user) {
                    response.status(200)
                    response.redirect(`/user/friends`)
                } else {
                    response.status(400)
                    response.setFlash("Cannot denie the frienship request")
                    response.redirect(`/user/friends`)
                }
            }
        )

    }
    else {
        response.status(400)
        response.render("users/friends")
    }
}


function requestFriend(request, response, next) {
    if (request.params.userId === undefined) {
        response.status(400)
        //TODO configurar flash
        response.setFlash("user requested does not exists")
        response.render("users/friends")
    }
    else {
        let userId = request.session.currentUser
        let userRequested = request.params.userId

        DaoUser.newRequestFriend(userId, userRequested,
            function (err, user) {
                if (err) {
                    next(err)
                } else if (user) {
                    response.status(200)
                    response.redirect(`/user/friends`)
                } else {
                    response.status(400)
                    response.setFlash("Cannot get a friendship request")
                    response.redirect(`/user/friends`)
                }
            }
        )

    }
}

function modifyUser(request, response, next) {
    if (request.body.user_email == '' || request.body.user_password == '' || request.body.user_name == '' ||
        request.body.user_genre == '' || request.body.user_birthday == ''){
            response.status(400)
            response.setFlash("Some field not filled")
            response.redirect("/user/modify")
        }
    else {
        let userRequested = {
            email: request.body.user_email,
            password: request.body.user_password,
            name: request.body.user_name,
            genre: request.body.user_genre,
            birthday: request.body.user_birthday,
            image: null
        }

        if (request.file) {
            userRequested.image = request.file.buffer
        }

        DaoUser.modifyUser(userRequested.email, userRequested.password,
            userRequested.name, userRequested.genre, userRequested.image, userRequested.birthday,
            request.session.currentUser,
            function (err, user) {
                if (err) {
                    next(err)
                } else if (user) {
                    response.status(200)
                    response.redirect(`/user/profile`)
                } else {
                    response.status(401)
                    response.redirect("/user/modify")
                }
            })
    }
}

function searchUsers(request, response, next) {

    if (request.body.name_search === undefined) {
        response.status(400)
        response.setFlash("No user specified for be searched")
        response.render("users/friends")
    }
    else {
        let name = request.body.name_search

        DaoUser.getUsersByName(name,
            function (err, usersList) {
                if (err) {
                    next(err)
                } else if (usersList.length >= 1) {
                    response.status(200)
                    response.render("users/search", { name, usersList: usersList })
                } else {
                    response.status(200)
                    response.setFlash("No users found")
                    response.render("users/search", {name, usersList: []})
                }
            })
    }
}

function signout(request, response, next) {
    response.status(200)
    request.session.destroy()
    response.redirect(`/login`)
}

function getUserImage(req, res, next) {

    DaoUser.getUserImage(req.params.userId, function (err, img) {
        if (err) {
            console.log(err)
            next(err)
        }

        console.log(img)
        if (img === null) {
            res.status(200)
            res.sendFile(path.join(__dirname, '../public/img', 'user.png'))
        }
        else {
            res.status(200)
            res.end(img)
        }
    })
}

module.exports = {
    loadModifyPage: loadModifyPage,
    getUser: getUser,
    modifyUser: modifyUser,
    searchUsers: searchUsers,
    getFriends: getFriends,
    acceptRequest: acceptRequest,
    denieRequest: denieRequest,
    requestFriend: requestFriend,
    getUserImage: getUserImage,
    signout: signout
};