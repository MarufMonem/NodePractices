var express         = require("express");
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var methodOverride  = require("method-override");
var expressSanitizer= require("express-sanitizer");
var app             = express();

app.set("view engine","ejs");
//custom style sheet location
app.use(express.static("public"));
//using body parser
app.use(bodyParser.urlencoded({extended:true}));
//connecting to mongoDB
mongoose.connect("mongodb://localhost/restful_blog_app");
//using sanitizer
app.use(expressSanitizer());
//using method override
app.use(methodOverride("_method"));

//Schema
var blogSchema = new mongoose.Schema({
    title   :String,
    image   :String,
    body    :String,
    created :{type: Date, default: Date.now}
});
//Mongoose Model
var blog = mongoose.model("blog", blogSchema); 

//Test data
// blog.create({
//     title: "Learning node!! :o",
//     image: "https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
//     body:  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//     //leaving created blank.
// },function(err, blog){
//     if(err){
//         console.log("ERR Found: " + err);
//     }else{
//         console.log(blog);
//     }
// });


//RESTful Routes

//INDEX route
app.get("/", function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    blog.find({}, function(err,foundBlogs){
        if(err){
            console.log("There was an error in retriving");
            console.log(err);
        }else{
            res.render("index",{blogs:foundBlogs});
        }
    });
});

//NEW route
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//CREATE route
app.post("/blogs", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err,createdBlog){
        //takes the blog object data and sends that
        if(err){
            res.redirect("/new");
        }else{
            res.redirect("/blogs");
        }
        
    });
});

//SHOW route
app.get("/blogs/:id", function(req,res){
    blog.findById(req.params.id, function(err,foundBlog){
        //takes the blog object data and sends that
        if(err){
            console.log("*****************************************");
            console.log("There was an error");
            console.log("*****************************************");
            res.redirect("/blogs");
        }else{
            console.log("*****************************************");
            console.log("Found Blog: " + foundBlog);
            console.log("*****************************************");
            res.render("show", {blog:foundBlog});
        }
        
    });
});


//EDIT route
app.get("/blogs/:id/edit", function(req,res){
    blog.findById(req.params.id, function(err,foundBlog){
        //takes the blog object data and sends that
        if(err){
            console.log("*****************************************");
            console.log("There was an error");
            console.log("*****************************************");
            res.redirect("/blogs");
        }else{
            console.log("*****************************************");
            console.log("Found Blog: " + foundBlog);
            console.log("*****************************************");
            res.render("edit", {blog:foundBlog});
        }
        
    });
});

//UPDATE route
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log("*****************************************");
            console.log("There was an error");
            console.log("*****************************************");
            res.redirect("/blogs");
        }else{
            console.log("*****************************************");
            console.log("Found Blog: " + updatedBlog);
            console.log("*****************************************");
            res.redirect("/blogs/"+ req.params.id);
        }
    })
});


//DELETE route
app.delete("/blogs/:id", function(req,res){
    blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log("*****************************************");
            console.log("There was an error");
            console.log("*****************************************");
            res.redirect("/blogs");
        }else{
            console.log("*****************************************");
            console.log("Deleted Blog:");
            console.log("*****************************************");
            res.redirect("/blogs");
        }
    })
});




//Conneting to server
app.listen(5500,"127.0.0.1",function(){
    console.log("Started");
});
