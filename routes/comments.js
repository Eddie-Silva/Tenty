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

//COMMENTS EDIT route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
         res.redirect("back")
      } else {
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); //req.params.id is coming from app.js 
      }
   });
});

//COMMENT UPDATE route
router.put("/:comment_id", checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
         res.redirect("back")
      } else {
         res.redirect("/campgrounds/" + req.params.id)
      }
   });
});

//COMMENT DESTROY route
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
   //find by id and remove
   Comment.findByIdAndRemove(req.params.comment_id, function(err,){
      if(err){
         res.redirect("back")
      } else {
         res.redirect("/campgrounds/" + req.params.id)
      }
   });
});

//MIDDLEWARE

//check if user that is loged in is the owner
function checkCommentOwnership(req, res, next){
   if(req.isAuthenticated()){
      Campground.findById(req.params.comment_id, function(err, foundComment){
         if(err){
            res.redirect("back");
         } else {
            //does user own comment
            if(foundComment.author.id.equals(req.user._id)){ //'equals' is a built in method in mongoose
              next();
            } else {
               res.redirect("back");
            }   
         }
      });
   } else {
      res.redirect("back");
   }
}

//loged in checked
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   };
   res.redirect("/login");
}


module.exports = router;