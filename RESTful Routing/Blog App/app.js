var express         = require("express");
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var app             = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.get("/", function(req,res){
    res.send("Welcome to my assignment");
});

//Conneting to server
app.listen(5500,"127.0.0.1",function(){
    console.log("Started");
});
