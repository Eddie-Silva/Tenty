let express = require("express");
let router = express.Router();
var Campground = require("../models/campground")
var middleware = require("../middleware") //index.js is not explicitaly required it is already required


//INDEX
router.get("/", function(req, res){

   Campground.find({}, function(err, allCampgrounds){ //finds all the data from Campground DB
      if(err){
         console.log(err);
      } else {
         console.log("displaying all campgrounds");
         res.render("campgrounds/index", {campgrounds: allCampgrounds}) // takes the data from CampgroundDB and passes it as 'campgrounds' object to 'campgrounds.ejs  
      }
   
   });
  
});

//CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){

   //get data from form and add to campgrunds

   let newName = req.body.name; // the data of the field with the name atribute 'name'
   let newPrice = req.body.price
   let newImage = req.body.image; // the data of the field with the name atribute 'image'
   let newDescription = req.body.description;
    //console.log(req.user); --view the user data
    let author = {
      id: req.user._id,
      username: req.user.username
   };
   let newCampground = {name: newName, price:newPrice, image: newImage, description: newDescription, author: author}; //makes a new {} with the propertie = to the var newName and newImage

   Campground.create(newCampground, function(err, newlyCreated){ //Create new campground and save to database
      if(err){
         console.log(err);
      } else {
         console.log(newlyCreated);//view new created campground
         
        res.redirect("/campgrounds");  //redirect back to campground get page 
      }
   });

   
   
});


//NEW route
router.get("/new", middleware.isLoggedIn, function(req, res){
  
   res.render("campgrounds/new.ejs");
});


//SHOW ROUTE - shows detail info on selected campground
router.get("/:id", function(req, res){
   
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ //find campground with provided ID, then show template.
      if(err){
         console.log(err);
      } else {
         res.render("campgrounds/show", {campground: foundCampground});
         }
   });
   
});

//EDIT Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   //check if user is logged in
   Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground:foundCampground}); 
   });
});

//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   //find and update
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   })
   //redirect
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect("/campgrounds")
      } else {
         res.redirect("/campgrounds")
      }
   });
});




module.exports = router;