var express = require("express");
var router = express.Router({mergeParams:true});
var campground = require("../models/campground");
var comment = require("../models/comment");
//Comment Routes

//Comments Form
router.get("/new",isloggedIn,function(req,res){
    campground.findById(req.params.id,function(err,foundCamp){
        res.render("comments/new",{camp:foundCamp});
    });

});

//Comments Form
router.post("/",function(req,res){
    campground.findById(req.params.id,function(err,foundCamp){
        console.log("***************comments***********************");
        console.log("THE FOUND CAMP: " + foundCamp);
        console.log("===============comments=======================");
        if(err){
            console.log("ERROR :" + err);
            res.redirect("/campgrounds/"+ req.params.id);
        }else{
            comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err);
                }else{
                    foundCamp.comments.push(newComment);
                    foundCamp.save(function(err, savedCampground){
                        if(err){
                            console.log("Couldnt add the comment");
                        }else{
                            res.redirect("/campgrounds/"+ req.params.id);
                        }
                    });
                }
            });
        }

    });

});

//logged in checker
function isloggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports= router;