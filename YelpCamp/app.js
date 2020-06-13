var express         = require("express");
var app             = express();
var mongoose        = require("mongoose");
var bodyParser      = require("body-parser");
mongoose.set('useUnifiedTopology', true); //removing deprication errors
mongoose.connect("mongodb://localhost/yelp_camp" ,{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");


//Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var campground = mongoose.model("campground", campgroundSchema);

//Creating and adding campgrounds to the DB
// campground.create({
//     name:"Morog Pahar",
//     image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
// }, function(err, campground){
//     if(err){
//         console.log("There is an error in adding new campground");
//     }else{
//         console.log("New campground added: ");
//         console.log(campground);
//     }
// })


//root path
app.get("/", function(req,res){
    res.render("landing");
});
//all campgrounds
app.get("/campgrounds", function(req,res){
    //get all campgrounds
    campground.find({},function(err, allCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds",{campgrounds:allCampground});
        }
    })
});

//POST route for creating new camp grounds(restful routing)
app.post("/campgrounds", function(req,res){

    //get data from form and add to campground array
    var name = req.body.name;
    var url = req.body.imgUrl;
    var newCampground = {
        name:name,
        image:url
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

//creating new campgrounds form page
app.get("/campgrounds/new", function(req,res){
    res.render("new");
});



//connection
app.listen(5500,"127.0.0.1", function(){
    console.log("Yelp Camp has started");
})
