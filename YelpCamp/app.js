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
    image: String,
    description: String
});

var campground = mongoose.model("campground", campgroundSchema);

//Creating and adding campgrounds to the DB
// campground.create({
//     name:"Grnaite Hill",
//     image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//     description: "A walk along the granaite hill. See your dreams come to life!"
// }, function(err, campground){
//     if(err){
//         console.log("There is an error in adding new campground");
//     }else{
//         console.log("New campground added: ");
//         console.log(campground);
//     }
// });


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
