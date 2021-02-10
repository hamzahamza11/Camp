var mongoose = require("mongoose");
var campground = require("./models/campground");
var comment = require("./models/comment");

var data =[{name :"dogs",
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgZG_Lfl5dTMdztFw3SjrymaO3NSNbshVMw82RoUEggBMukw64aQ",
description:"the most beatiful thing "},

	{name:"Cats",
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKB9m2IVeW3oLi5Gyt6zxedCXCQJcgLOarrRDwx9kygnVlhH06",
description:"the most hatefull thing "}
,

	{name :"Birds",
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmk_AqLKy4Mqbl2YyDo5BI4hmUTPD-zzKg71awPDsF3bpxkLXE",
description:"the most amazing thing "}
];

function seeds(){
	campground.remove( {} ,function(err){
	if(err){
		console.log(err);

	}
	else{
		console.log("removed");
     data.forEach(function(seed){
	campground.create(seed,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			     console.log("camp added");
						comment.create( {
							text:"great post",author:"just me"
						} ,function(err,data){
			               if(err){
			               	console.log(err);
			               }
			               else{
                                campground.comment.push(data);
                                campground.save();
                                console.log("created a new comment");
			               }
						});
		}
	});
});
	}
});
}


module.exports = seeds ;
