

var mongoose = require("mongoose");

var yelpSchema =new mongoose.Schema({
    name : String,
    image:String,
    description:String,
    comment : [
    {
	type: mongoose.Schema.Types.ObjectId,
	ref: "comment"
    }
]

 });

module.exports= mongoose.model("campground",yelpSchema);