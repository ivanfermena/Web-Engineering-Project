"use strict";

const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set("views",path.join(__dirname, "views"));

app.use(express.static(__dirname + '/public'));

// Enruted
app.get("/answer", function (request, response) {
    response.render("answer");
});

app.get("/friends", function (request, response) {
    response.render("friends");
});

app.get("/login", function (request, response) {
    response.render("login");
});

app.get("/question", function (request, response) {
    response.render("question");
});

app.get("/random", function (request, response) {
    response.render("random");
});

app.get("/register", function (request, response) {
    response.render("register");
});

app.get("/search", function (request, response) {
    response.render("search");
});

app.get("/user", function (request, response) {
    response.render("user");
});

app.use(middlewareNotFoundError);
app.use(middlewareServerError);

function middlewareNotFoundError(request, response){
  response.status(404);
  response.render("404");
}

function middlewareServerError(error, request, response, next){
  response.status(500);
  response.end();
}

// APP Listen
app.listen(3000, (err) => {
    if (err) console.log(err);
    else console.log("Server listen: localhost:3000");
})
