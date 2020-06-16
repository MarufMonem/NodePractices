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
app.use(bodyParser.urlencoded({extended:true}));
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

//this line is telling passport to use the user authenticate method
//which is given to the userSchema
passport.use(new localStrategy(user.authenticate()))
//These 2 lines are responsible for reading the session, taking the
//date from the session encode and decoding it
//this is able to do this becuase we included passport methods in
//the userSchema.
passport.serializeUser(user.serializeUser()); //encode
passport.deserializeUser(user.deserializeUser()); //decode

// ************************************
// ROUTES
// ************************************

//Root or Index path
app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isloggedIn, function(req, res){
    res.render("secret");
});

//AUTH ROUTES

//NEW
app.get("/register", function(req, res){
    res.render("register");
});

//CREATE
app.post("/register", function(req, res){
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
                res.redirect("/secret");
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
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret", //if the login was successful
    failureRedirect: "/login" // if it wasnt
}) , function(req, res){
    
});

//logging out handler
app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
});

//logged in checker

function isloggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

//connection
app.listen(5500,"127.0.0.1", function(){
    console.log("Authentication has started");
});