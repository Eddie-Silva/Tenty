let express = require("express");
let router = express.Router({mergeParams: true}); //mergeParams required in order to access :id
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//COMMENTS ROUTES

//NEW route
router.get("/new", isLoggedIn, function(req, res){ //middleware func to check if is logged in
   Campground.findById(req.params.id, function(err, campground){
      if(err){
         console.log();
         
      } else{
         res.render("comments/new", {campground: campground});
      }
   });
});

//COMMENTS create
router.post("/", isLoggedIn, function(req,res){
   //lookup compground using ID
   Campground.findById(req.params.id, function(err, campground){
      if(err){
         console.log(err);
         res.redirect("/campgroudns");
      } else {
         //create new comment
         Comment.create(req.body.comment, function(err, comment){
            if(err){
               console.log(err);
               
            } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save()
               //connect new comment to campground
               campground.comments.push(comment)
               campground.save();
               res.redirect("/campgrounds/" + campground._id);
              }
         });
         }
   });
});


//loged in checked
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   };
   res.redirect("/login");
}


module.exports = router;