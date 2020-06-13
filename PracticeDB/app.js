var mongoose = require("mongoose");
mongoose.set('useUnifiedTopology', true); //removing deprication errors
mongoose.connect("mongodb://localhost/cat_app" ,{ useNewUrlParser: true });


//Schema
var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament:String
});
// Model
var cat = mongoose.model("cat", catSchema);

//adding a cat
// var puffy = new cat({
//     name: "henry",
//     age: 9,
//     temperament:"annoying"
// });

// puffy.save(function(err, cat){
//     if(err){
//        console.log("ERR");
//     }else{
//         console.log("saved");
//         console.log(cat);
        
//     }
// });
cat.create({
    name:"snowFlake",
    age:3,
    temperament:"nice"
},function(err,cat){
    if(err){
               console.log("ERR");
            }else{
                console.log("saved");
                console.log(cat);
            }
})
    
cat.find({}, function(err, cats){
    if(err){
        console.log("VHUL SHOB VHUL");
    }else{
        console.log("THE CATS");
        console.log(cats);
    }
});