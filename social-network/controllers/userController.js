"use strict";

const mysql = require('mysql')
const path = require('path')

const config = require('../config.js')
const daoUser = new require('./../models/user')

const pool = mysql.createPool(config.mysqlConfig)

const DaoUser = new daoUser(pool)


function getUser(request, response, next) {
    let userId = request.params.userId
    DaoUser.getUser(userId,
        function (err, user) {
            if (err) {
                next(err)
            } else if (user) {
                response.status(200)
                let currentUser = false
                if (request.session.currentUser.id == userId) {
                    request.session.currentUser.points = user.points
                    currentUser = true
                }
                response.render("users/profile", {user: request.session.currentUser,
                     userInfo: user, modify: currentUser })
            } else {
                response.status(404)
                response.setFlash("User does not exists")
                if (!(currentUser)) {
                    response.redirect("/user/friends")
                }
                else {
                    next(new Error("current user not exists into DB"))
                }
            }
        })
}

function getFriends(request, response, next) {

    let userId = request.session.currentUser.id

    DaoUser.getFriends(userId,
        function (err, friendsList) {
            if (err) {
                next(err)
            } else {
                DaoUser.getFriendshipRequests(userId,
                    function (err, requestedFriendsList) {
                        if (err) {
                            next(err)
                        } else {
                            response.status(200)
                            response.render("users/friends",
                                {
                                    user: request.session.currentUser,
                                    friendsList: friendsList,
                                    requestedFriendsList: requestedFriendsList
                                })
                        }
                    }
                )
            }
        }
    )

}



function acceptRequest(request, response, next) {

    if (request.params.userId === undefined) {
        response.status(400)
        response.setFlash("Friend id not specified")
        response.rendirect("/user/friends")
    }
    else {
        let userRequested = request.session.currentUser.id
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

        let userId = request.session.currentUser.id
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
        response.setFlash("user requested does not exists")
        response.render("users/friends")
    }
    else {
        let userId = request.session.currentUser.id
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

function loadModifyPage(request, response, next) {
    response.status(200)
    response.render("users/modify", {user: request.session.currentUser})
}

function modifyUser(request, response, next) {
    if (request.body.user_email == '' || request.body.user_password == '' || request.body.user_name == '' ||
        request.body.user_genre == '' || request.body.user_birthday == '') {
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
            request.session.currentUser.id,
            function (err, user) {
                if (err) {
                    next(err)
                } else if (user) {
                    response.status(200)
                    response.redirect(`/user/profile/`+request.session.currentUser.id)
                }
            })
    }
}

function loadSearchPage(request, response, next) {
    response.status(200)
    response.render("user/search")
}

function searchUsers(request, response, next) {

    if (request.body.name_search === undefined || request.body.name_search === '') {
        response.status(400)
        response.setFlash("No user specified for be searched")
        response.redirect("/user/friends")
    }
    else {
        let name = request.body.name_search
        let idUserLogin = request.session.currentUser.id

        DaoUser.getUsersByName(name, idUserLogin,
            function (err, usersList) {
                if (err) {
                    next(err)
                } else if (usersList.length >= 1) {
                    response.status(200)
                    response.render("users/search", {user: request.session.currentUser,
                         name: name, usersList: usersList })
                } else {
                    response.status(200)
                    response.setFlash("No users found")
                    response.render("users/search", { user: request.session.currentUser,
                        name: name, usersList: [] })
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
    loadSearchPage: loadSearchPage,
    searchUsers: searchUsers,
    getFriends: getFriends,
    acceptRequest: acceptRequest,
    denieRequest: denieRequest,
    requestFriend: requestFriend,
    getUserImage: getUserImage,
    signout: signout
};