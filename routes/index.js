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
        console.log(err);
        return res.render("register");
     }
     passport.authenticate("local")(req, res, function(){
        res.redirect("/campgrounds")
     })
  })

});

//show login formm
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
   res.redirect("/campgrounds");
})


////////////////
//loged in checked middleware
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   };
   res.redirect("/login");
}

module.exports = router;