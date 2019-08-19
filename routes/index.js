let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");




//ROOT ROUTE

router.get("/", function(req, res){
   res.render("landing");
});

//AUTH ROUTES

router.get("/register", function(req, res){
   res.render("register")
});

//Handle Sign up logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
     if(err){
      req.flash("error", err.message);
      return res.redirect("/register");
     }
     passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome to LiftCamp " + user.username);
        res.redirect("/campgrounds")
     })
  })

});

//show login form
router.get("/login", function(req, res){
   res.render("login");
})

//handle login logic
router.post("/login", passport.authenticate("local", {
   successRedirect:"/campgrounds",
   failureRedirect: "/login"
}),function(req, res){
  
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
   req.logOut();//method comes from packages
   req.flash("success", "Logged out!")
   res.redirect("/campgrounds");
})


module.exports = router;