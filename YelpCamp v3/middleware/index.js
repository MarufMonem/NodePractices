var campground = require("../models/campground");
var comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) { //Middleware to check authorization

    if (req.isAuthenticated()) { //is the person logged in
        campground.findById(req.params.id, function (err, foundCamp) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    //we dont want it to do this all the time this should
                    //be dynamic so move on to the next function
                    //res.render("campgrounds/edit", {campground: foundCamp});
                    next();
                } else {
                    res.send("You are not authorized");
                }
            }
        });
    } else {
        res.redirect("/login");
    }
};


//Middleware to check authorization
middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) { //is the person logged in
        comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    //we dont want it to do this all the time this should
                    //be dynamic so move on to the next function
                    //res.render("campgrounds/edit", {campground: foundCamp});
                    next();
                } else {
                    res.send("You are not authorized");
                }
            }
        });
    } else {
        res.redirect("/login");
    }
};
//logged in checker
middlewareObj.isloggedIn = function isloggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
module.exports = middlewareObj;

