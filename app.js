var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var campground = require("./models/campground");
var seeds = require("./seeds");
var comment = require("./models/comment");
var passport = require("passport");
var localstrategy = require("passport-local");
var user = require("./models/user");
mongoose.connect("mongodb://localhost/yelp_camp");
 

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
  //passport 
 app.use(require("express-session")({
 	secret: "some random shit",
 	 resave: false,
 	 saveUninitialized: false
 }));
passport.use(new localstrategy( user.authenticate()));
 app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

seeds();


app.get("/",function(req,res){
  res.render("landing");
});

app.get("/campgrounds",function(req,res){
	
	campground.find({},function(err,campgrounds)
	{
		if(err)
		{
			console.log(err);
		}
		else{
			
			res.render("campgrounds", {campgrounds:campgrounds,currentuser:req.user});
		}

	});
	
 
});
 
 app.post("/campgrounds",function(req,res){
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

 app.get("/campgrounds/new",function(req,res){
    res.render("newcamp");
 });

 app.get("/campgrounds/:id",function(req,res){
 	campground.findById(req.params.id).populate("comment").exec(function(err,foundcampgound){
    if(err){
    	console.log(err)
    }
    else{
    	res.render("show", {campground: foundcampgound});
    }
 	});
  
 });

 app.get("/campgrounds/:id/comments/new",function(req,res){
 	campground.findById(req.params.id,function(err,foundcampgound){
 		if(err){
 			console.log(err)
 		}
 		else{
 			 	res.render("newcomment",{campground:foundcampgound});

 		}
 	})
 });

 app.post("/campgrounds/:id/comments",isloggedin,function(req,res){
 	
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


 app.get("/register",function(req,res){
 	res.render("register");
 });

 app.post("/register",function(req,res){
 	user.register(new user({username: req.body.username}),req.body.password,function(err,user){
 		if(err){
 			console.log(err);
 			res.redirect("/register");
 		}
 		passport.authenticate("local")(req,res,function(){
 			res.redirect("/campgrounds");
 		});

 	});
 });
app.get("/login",function(req,res){
 	res.render("login");
 });

 app.post("/login",passport.authenticate("local",{
 	successRedirect: "/campgrounds",
 	failureRedirect:"/login"
           }),function(req,res){

 });
  

app.get("/logout",function(){
   req.logout();
   res.redirect("/campgrounds");
});

function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		console.log("next");
		next();

	}
	res.redirect("/login");
}


app.listen(3001,"localhost");