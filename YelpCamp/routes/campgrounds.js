var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
//all campgrounds (INDEX)
router.get("/", function(req,res){
    //get all campgrounds
    campground.find({},function(err, allCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampground, currentUser:req.user});
        }
    })
});

//POST route for creating new camp grounds(restful routing CREATE)
router.post("/", isloggedIn, function(req,res){

    //get data from form and add to campground array
    //here we are not using params because the data is not coming from the URL
    var name = req.body.name;
    var url = req.body.imgUrl;
    var description = req.body.description; 
    var newCampground = {
        name:name,
        image:url,
        description: description
    }

    //create new campground and save
    campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect back to /campgrounds
            res.redirect("/campgrounds");
        }
    })

});

//creating new campgrounds form page (NEW)
router.get("/new",isloggedIn, function(req,res){
    res.render("campgrounds/new");
});

// Path for particular campground (SHOW)
//REMEMBER anything that has : should be at the end
router.get("/:id", function(req, res){

    campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        console.log("**************************************");
        console.log("THE FOUND CAMP: " + foundCamp);
        console.log("======================================");
        console.log("THE FOUND CAMP COMMENTS: " + foundCamp.comments);
        console.log("**************************************");
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground:foundCamp});
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

module.exports = router;