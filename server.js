// Require express and path
var express = require("express");
var path = require("path");

// Create express app
var app = express();

// Require body-parser module
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Require querystring parser
var querystring = require("querystring");

// Static content
app.use(express.static(path.join(__dirname + "/static")));

// Setting ejs and view directories
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");

// Home page route
app.get("/", function(req, res) {
    res.render("index");
});

// For post actions
app.post("/result", function(req, res) {

    res.redirect("/");
});

// Express is listening to port 8000
var server = app.listen(8000, function(){
    // Server console log to show that node.js is running
    console.log("Node.js is listening to port 8000 test");
});

// Pass the server object to socket.io
var io = require("socket.io").listen(server);

// Get random number
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// Assign rand num var to zero
var getRandNum = 0;

// Inside this method server listens for events to occur
// and then can emit when an event from somewhere else,
// like a client occurs
io.sockets.on("connection", function (socket) {

    // This line console logs to
    // terminal if sockets are running
    console.log("Sockets are running!");

    // Listen for the form submission event
    // on the client side
    socket.on("posting_form", function (client_data) {
        getRandNum = randomNumber(1, 1000);

        var parseFormData = querystring.parse(client_data.response);

        console.log(parseFormData);
        var name = parseFormData.name;
        var dojo_location = parseFormData.dojo_location;
        var fav_language = parseFormData.fav_language;
        var comment = parseFormData.comment;

        socket.emit("updated_message", {response: "<p>You have emitted the following information to the server:<br />{ name: " + name + ", location: " + dojo_location + ", fav_language: " + fav_language + ", comment: " + comment + " }</p><p>Your lucky number emitted by the server is:<br />" + getRandNum + "</p>"}
        );

    });
});