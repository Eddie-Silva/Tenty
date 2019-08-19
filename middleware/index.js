var Campground = require("../models/campground")
var Comment = require("../models/comment")

//all the middle ware goes here
var middlewareObj = {};

//check if user that is loged in is the owner
middlewareObj.checkCampgroundOwnership = function(req, res, next){
   if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
         if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
         } else {
            //does user own campground?
            if(foundCampground.author.id.equals(req.user._id)){ //'equals' is a built in method in mongoose
              next()
            } else {
               req.flash("error", "You do not have permission.");
               res.redirect("back");
            }   
         }
      });
   } else {
      req.flash("error", "You do not have permision to do that.")
      res.redirect("back");
   }
}


//check if user that is loged in is the owner
middlewareObj.checkCommentOwnership = function(req, res, next){
   if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
         if(err || !foundComment){
            req.flash("error", "No comment found")
            res.redirect("/campgrounds");
         } else {
            //does user own comment
            if(foundComment.author.id.equals(req.user._id)){ //'equals' is a built in method in mongoose
              next();
            } else {
               req.flash("error", "You do not have permision to do that.")
               res.redirect("back");
            }   
         }
      });
   } else {
      req.flash("error", "You need to be logged in")
      res.redirect("back");
   }
}


//loged in checked
middlewareObj.isLoggedIn = function(req, res, next){
   if(req.isAuthenticated()){
      return next();
   };
   req.flash("error", "You need to be logged in.") //flash is active(not displayed yet) on next 'page'
   res.redirect("/login");
}



module.exports = middlewareObj;