var express         = require("express");
var app             = express();
var mongoose        = require("mongoose");
var bodyParser      = require("body-parser");
var campground      = require("./models/campground");
var comment         = require("./models/comment");
var seedDB          = require("./seed");
mongoose.set('useUnifiedTopology', true); //removing deprication errors
mongoose.connect("mongodb://localhost/yelp_camp" ,{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

seedDB();
//root path
app.get("/", function(req,res){
    res.render("landing");
});

//all campgrounds (INDEX)
app.get("/campgrounds", function(req,res){
    //get all campgrounds
    campground.find({},function(err, allCampground){
        if(err){
            console.log(err);
        }else{
            res.render("index",{campgrounds:allCampground});
        }
    })
});

//POST route for creating new camp grounds(restful routing CREATE)
app.post("/campgrounds", function(req,res){

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
app.get("/campgrounds/new", function(req,res){
    res.render("new");
});

// Path for particular campground (SHOW)
//REMEMBER anything that has : should be at the end
app.get("/campgrounds/:id", function(req, res){

    campground.findById(req.params.id, function(err, foundCamp){
        console.log("**************************************");
        console.log("THE GIVEN ID IS: " + req.params.id);
        console.log("**************************************");
        if(err){
            console.log(err);
        }else{
            res.render("show", {campground:foundCamp});
        }
    });

    
})



//connection
app.listen(5500,"127.0.0.1", function(){
    console.log("Yelp Camp has started");
})
