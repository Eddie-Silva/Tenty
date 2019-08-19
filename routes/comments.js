let express = require("express");
let router = express.Router({mergeParams: true}); //mergeParams required in order to access :id
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js") //'/index.js' is not explicitaly required it is already required


//COMMENTS ROUTES

//NEW comments route
router.get("/new", middleware.isLoggedIn, function(req, res){ //middleware func to check if is logged in
   Campground.findById(req.params.id, function(err, campground){
      if(err){
         console.log();
         
      } else{
         res.render("comments/new", {campground: campground});
      }
   });
});

//COMMENTS create
router.post("/", middleware.isLoggedIn, function(req,res){
   //lookup compground using ID
   Campground.findById(req.params.id, function(err, campground){
      if(err){
         req.flash("error", "Sorry comment was not created")
         console.log(err);
         res.redirect("/campgroudns");
      } else {
         //create new comment
         Comment.create(req.body.comment, function(err, comment){
            if(err){
               req.flash("error", "Something went wrong.")
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
               req.flash("success", "Successfully created comment");
               res.redirect("/campgrounds/" + campground._id);
              }
         });
         
         }
   });
});

//COMMENTS EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
      if(err || !foundCampground) {
         req.flash("error", "No campground found.");
         return res.redirect("back");
      } 
      Comment.findById(req.params.comment_id, function(err, foundComment){
         if(err){
            res.redirect("back")
         } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); //req.params.id is coming from app.js 
         }
      });
   });
});

//COMMENT UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
         res.redirect("back")
      } else {
         res.redirect("/campgrounds/" + req.params.id)
      }
   });
});

//COMMENT DESTROY route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   //find by id and remove
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
         res.redirect("back")
      } else {
         req.flash("success", "Comment deleted.")
         res.redirect("/campgrounds/" + req.params.id)
      }
   });
});




module.exports = router;