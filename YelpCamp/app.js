var express         = require("express");
var app             = express();
var mongoose        = require("mongoose");
var localStrategy   = require("passport-local");
var passport        = require("passport");
var passportLocalMongoose   = require("passport-local-mongoose");
var bodyParser      = require("body-parser");
var campground      = require("./models/campground");
var comment         = require("./models/comment");
var user            = require("./models/user");
var seedDB          = require("./seed");
mongoose.set('useUnifiedTopology', true); //removing deprication errors
mongoose.connect("mongodb://localhost/yelp_camp" ,{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIGURATION

app.use(require("express-session")({
    //secret code to encode and decode the username and password
    //can be anything you want
    secret: "Maruf Monem",
    resave: false,
    saveUninitialized:false
}));
//These 2 lines are used to make sure our app uses passport
app.use(passport.initialize());
app.use(passport.session());

//this line is telling passport to use the user authenticate method
//which is given to the userSchema
passport.use(new localStrategy(user.authenticate()))
//These 2 lines are responsible for reading the session, taking the
//date from the session encode and decoding it
//this is able to do this becuase we included passport methods in
//the userSchema.
passport.serializeUser(user.serializeUser()); //encode
passport.deserializeUser(user.deserializeUser()); //decode

//middleware for pasing logged in user information.
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next(); // for running the next part of the code
});

// seedDB();
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
            res.render("campgrounds/index",{campgrounds:allCampground, currentUser:req.user});
        }
    })
});

//POST route for creating new camp grounds(restful routing CREATE)
app.post("/campgrounds", isloggedIn, function(req,res){

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
app.get("/campgrounds/new",isloggedIn, function(req,res){
    res.render("campgrounds/new");
});

// Path for particular campground (SHOW)
//REMEMBER anything that has : should be at the end
app.get("/campgrounds/:id", function(req, res){

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

//Comment Routes

//Comments Form
app.get("/campgrounds/:id/comments/new",isloggedIn,function(req,res){
    campground.findById(req.params.id,function(err,foundCamp){
        res.render("comments/new",{camp:foundCamp});
    });

});

//Comments Form
app.post("/campgrounds/:id/comments",function(req,res){
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
    
 //***************************************** */ 
 //Auth Routes
 
 
//NEW
app.get("/register", function(req, res){
    res.render("register");
});

//CREATE
app.post("/register", isloggedIn, function(req, res){
    user.register(new user({username: req.body.username}), req.body.password, function(err, newUser){
        if(err){
            console.log("There is an error: " + err );
            res.redirect("/register");
        }else{
            //once the user is created this would run. 
            //This logs the user in handles everything related to the session
            //then run the serialize user method
            //then specifying that we would use local strategy
            passport.authenticate("local")(req,res, function(){
                res.redirect("/campgrounds");
            });
        }
    });
});

//Login Routes

//render the form NEW
app.get("/login", function(req, res){
    res.render("login");
});

//Create
//passport authenticate middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", //if the login was successful
    failureRedirect: "/login" // if it wasnt
}) , function(req, res){
    
});

//logging out handler
app.get("/logout", function(req, res){
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



 //***************************************** */

//connection
app.listen(5500,"127.0.0.1", function(){
    console.log("Yelp Camp has started");
})
