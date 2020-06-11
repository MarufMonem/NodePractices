var express = require("express");
var request = require("request");
var app = express();
app.set("view engine", "ejs");


app.get("/", function(req,res){
    res.render("search");
})

app.get("/results",function(req,res){
    //getting the value of the search
var movieName = req.query.movieName;
let url = "http://www.omdbapi.com/?s=" + movieName + "&apikey=thewdb";
    request(url,function(error,response,body){
        if(!error && response.statusCode==200){
           var parsedData = JSON.parse(body);
           res.render("results",{results:parsedData})
        //    res.send("The name of the movie is: " + parsedData.Title + " The rating in RT: " + parsedData.Ratings[1].Value);
        }
    });

})
app.listen(5500,"127.0.0.1",function(){
    console.log("App Started");
});