var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var user = require("../models/user");
var passport = require("passport");

///campgrounds
router.get("/",function(req,res){
	
	campground.find({},function(err,campgrounds)
	{
		if(err)
		{
			console.log(err);
		}
		else{
			
			res.render("campgrounds", {campgrounds:campgrounds, currentuser: req.user});
		}

	});
	
 
});
 
 router.post("/",function(req,res){
 	var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var obj = {name:name, image:image ,description:desc};
    campground.create(obj,function(err,campground)
    {
     if(err)
     {
     	console.log(err)
     }
     else{
     	res.redirect("/campgrounds");

     }
    });
    
 });
 router.get("/new",function(req,res){
    res.render("newcamp");
 });

router.get("/:id",function(req,res){
 	campground.findById(req.params.id).populate("comment").exec(function(err,foundcampgound){
    if(err){
    	console.log(err)
    }
    else{
    	res.render("show", {campground: foundcampgound});
    }
 	});
  
 });

module.exports = router;