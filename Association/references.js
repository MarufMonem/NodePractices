var express = require("express");
var mongoose = require("mongoose");
var app = express();

mongoose.connect("mongodb://localhost/restful_blog_app");

var post = require("./models/post");
var user = require("./models/user");

// user.create({
//     name: "Bob",
//     email: "bob@123.com"
// }, function(err, newUser){
//     if(err){
//         console.log("Couldnt create user");
//     }else{
//         console.log("created user");
//     }
// });

//post is independent of user
post.create({
    title: "Coding Right now!",
    content: "CODE CODE CODE!!!!"
}, function (err, newPost) {
    if (err) {
        console.log("Couldnt create post");
    } else {
        console.log("created post: " + newPost);
        user.findOne({ name: "Bob" }, function (err, foundUser) {
            foundUser.posts.push(newPost);
            foundUser.save(function (err, data) {
                if (err) {
                    console.log("Couldnt update user");
                } else {
                    console.log("Updated user");
                }
            });
        });
    }
});




//Conneting to server
app.listen(5500, "127.0.0.1", function () {
    console.log("Started");
});