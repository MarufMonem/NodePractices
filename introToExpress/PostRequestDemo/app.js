var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var friends= ["Maruf", "Anik", "Sanjida", "MIM"];

app.use(bodyParser.urlencoded({extended: true}));

//view engine for EJS extension
app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("home");
});

app.get("/friends", function(req,res){
    res.render("friends", {friends:friends});
});


app.post("/addFriend", function(req,res){
    var newFriend = req.body.name;
    console.log(newFriend);
    friends.push(newFriend);
    res.redirect("/friends");
});

app.listen(5500,"127.0.0.1",function(){
    console.log("Started");
});