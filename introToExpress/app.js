var express = require("express");
var app = express();

//creating routes

app.get("/", function(req,res){
    res.send("Hello!");
});

app.get("/bye", function(req,res){
    res.send("have to go! BYE");
});

app.get("/cat", function(req,res){
    res.send("MEOW");
});

app.listen(5500,"127.0.0.1",function(){
    console.log("Started");
});