var express = require("express");
var router = express.Router({mergeParams:true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware");
//Comment Routes

//Comments Form
router.get("/new",middleware.isloggedIn,function(req,res){
    campground.findById(req.params.id,function(err,foundCamp){
        res.render("comments/new",{camp:foundCamp});
    });

});

//Comments create logic handler
router.post("/",middleware.isloggedIn,function(req,res){
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
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
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

//EDIT comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id, comment:foundComment}); //camp id is already defined in the route. /campgroud/:id
        }
    })
    
});

// Comment update route
router.put("/:comment_id/edit", middleware.checkCommentOwnership,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});


// Comment Delete route
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

module.exports= router;