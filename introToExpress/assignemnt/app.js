var express = require("express");
var app = express();

app.get("/", function(req,res){
    res.send("Welcome to my assignment");
});

app.get("/speak/:animal", function(req,res){
var animalName = req.params.animal;
    if(animalName == "cow"){
        res.send("moo");
    }
    else if(animalName=="cat"){
        res.send("MEOW");
    }
    else{
        res.send("THIS IS A MYTHICAL CREATURE");
    }
    res.send("Welcome to my assignment");
});
app.get("/repeat/:text/:number", function(req,res){
    var value = parseInt(req.params.number);
    var text = req.params.text;
    var output="";
    for (let index = 0; index < value; index++) {
        output=output+text+" ";
    }
    res.send(output);
});

app.get("*", function(req,res){
    res.send("Wrong place bruh");
});

app.listen(5500,"127.0.0.1",function(){
    console.log("Started");
});
