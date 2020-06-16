var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    user                    = require("./models/user"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");
// const { Passport } = require("passport");
mongoose.set('useUnifiedTopology', true); //removing deprication errors
//mongoose connecton to the DB
mongoose.connect("mongodb://localhost/auth_demo_app" ,{ useNewUrlParser: true });

var app = express();
app.set("view engine", "ejs");

//complex shortcut method to use a package in the app
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

//These 2 lines are responsible for reading the session, taking the
//date from the session encode and decoding it
//this is able to do this becuase we included passport methods in
//the userSchema.
passport.serializeUser(user.serializeUser()); //encode
passport.deserializeUser(user.deserializeUser()); //decode
//Root or Index path
app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
});

//connection
app.listen(5500,"127.0.0.1", function(){
    console.log("Authentication has started");
});