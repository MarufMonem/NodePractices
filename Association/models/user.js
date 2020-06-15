var mongoose        = require("mongoose");
//Schema User
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]
});
module.exports = mongoose.model("user", userSchema);