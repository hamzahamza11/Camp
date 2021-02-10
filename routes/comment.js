var express = require("express");
var router = express.Router({ mergeParams: true });
var comment = require("../models/comment");
var campground = require("../models/campground");

function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		console.log("next");
		next();

	}
	res.redirect("/login");
}


///campgrounds/:id/comments

 router.get("/new", isloggedin ,function(req,res){
 	campground.findById(req.params.id,function(err,foundcampgound){
 		if(err){
            console.log("there is an error");
 			console.log(err)
 		}
 		else{
 			 	res.render("newcomment",{campground:foundcampgound});

 		}
 	})
 });

 router.post("/",isloggedin,function(req,res){
 	
     campground.findById(req.params.id,function(err,foundcampground){
     	if(err){
     		console.log(err);
     		res.redirect("/campgrounds");
     	}else{
     		comment.create(req.body.comment,function(err,comment){
                     if(err){
                     	console.log(err);
                     }else{
                        foundcampground.comment.push(comment);
 	                    foundcampground.save();
 	                    res.redirect("/campgrounds/"+foundcampground._id);
                     }
     		});
     	}
     });

 	
 	
 });

module.exports = router;

