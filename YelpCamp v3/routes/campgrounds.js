var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware");

//all campgrounds (INDEX)
router.get("/", function (req, res) {
    //get all campgrounds
    campground.find({}, function (err, allCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampground, currentUser: req.user });
        }
    })
});

//POST route for creating new camp grounds(restful routing CREATE)
router.post("/", middleware.isloggedIn, function (req, res) {

    //get data from form and add to campground array
    //here we are not using params because the data is not coming from the URL
    var name = req.body.name;
    var url = req.body.imgUrl;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        image: url,
        description: description,
        author: author
    }

    //create new campground and save
    campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to /campgrounds
            res.redirect("/campgrounds");
        }
    })

});

//creating new campgrounds form page (NEW)
router.get("/new", middleware.isloggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// Path for particular campground (SHOW)
//REMEMBER anything that has : should be at the end
router.get("/:id", function (req, res) {

    campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        console.log("**************************************");
        console.log("THE FOUND CAMP: " + foundCamp);
        console.log("======================================");
        console.log("THE FOUND CAMP COMMENTS: " + foundCamp.comments);
        console.log("**************************************");
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCamp });
        }
    });


});

//Edit Campground Form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    //is the person logged in
    campground.findById(req.params.id, function (err, foundCamp) {
        res.render("campgrounds/edit", { campground: foundCamp });
    });
});

//Edit logic
router.put("/:id",middleware.checkCampgroundOwnership, function (req, res) {
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCamp) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }

    });

});

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // campground.findByIdAndRemove(req.params.id, function(err){

    //     res.redirect("/campgrounds");
    // });
    campground.findById(req.params.id, function (err, foundCamp) {

        foundCamp.comments.forEach(function (commentID) {
            comment.findByIdAndDelete(commentID, function (err) {
                console.log("DELETED");
            });
        });
        foundCamp.remove();
        res.redirect("/campgrounds");
    })
});





module.exports = router;