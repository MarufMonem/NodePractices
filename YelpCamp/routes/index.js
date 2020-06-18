var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");
//root path
router.get("/", function(req,res){
    res.render("landing");
});
//NEW
router.get("/register", function(req, res){
    res.render("register");
});

//CREATE
router.post("/register", function(req, res){
    user.register(new user({username: req.body.username}), req.body.password, function(err, newUser){
        if(err){
            console.log("There is an error: " + err );
            res.redirect("/register");
        }else{
            //once the user is created this would run. 
            //This logs the user in handles everything related to the session
            //then run the serialize user method
            //then specifying that we would use local strategy
            console.log("Successful: " );
            passport.authenticate("local")(req,res, function(){
                res.redirect("/campgrounds");
            });
        }
    });
});

//Login Routes

//render the form NEW
router.get("/login", function(req, res){
    res.render("login");
});

//Create
//passport authenticate middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", //if the login was successful
    failureMessage: "Wrong password",
    failureRedirect: "/login" // if it wasnt
}) , function(req, res){
    
});

//logging out handler
router.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/campgrounds");
});

//logged in checker
function isloggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;