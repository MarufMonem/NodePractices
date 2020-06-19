var express         = require("express");
var app             = express();
var mongoose        = require("mongoose");
var localStrategy   = require("passport-local");
var methodOverride  = require("method-override");
var passport        = require("passport");
var passportLocalMongoose   = require("passport-local-mongoose");
var bodyParser      = require("body-parser");
var campground      = require("./models/campground");
var comment         = require("./models/comment");
var user            = require("./models/user");
var seedDB          = require("./seed");

var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
mongoose.set('useUnifiedTopology', true); //removing deprication errors
mongoose.connect("mongodb://localhost/yelp_camp" ,{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

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

app.use("/",indexRoutes); //add / means its the same location
app.use("/campgrounds/:id/comments",commentRoutes); //what this is doing is that all campground routes append this /campground before there own routes
app.use("/campgrounds",campgroundRoutes); //what this is doing is that all campground routes append this /campground before there own routes

//connection
app.listen(5500,"127.0.0.1", function(){
    console.log("Yelp Camp has started");
})
