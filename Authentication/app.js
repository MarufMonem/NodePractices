var express = require("express");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/auth_demo_app");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
});

//connection
app.listen(5500,"127.0.0.1", function(){
    console.log("Authentication has started");
});