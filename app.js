let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let Campground = require("./models/campground");
let Comment = require("./models/comment");
let seedDB = require("./seeds");
let User = require("./models/user");


//Configuration
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true}); //connects to mongoose and create database
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "amarillo is a dog",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ //called on every route
   res.locals.currentUser = req.user; //pass to every templete
   next();
})


//ROUTES

app.get("/", function(req, res){
   res.render("landing");
});

//INDEX
app.get("/campgrounds", function(req, res){

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
app.post("/campgrounds", function(req, res){

   //get data from form and add to campgrunds

   let newName = req.body.name; // the data of the field with the name atribute 'name'
   let newImage = req.body.image; // the data of the field with the name atribute 'image'
   let newDescription = req.body.description;
   let newCampground = {name: newName, image: newImage, description: newDescription}; //makes a new {} with the propertie = to the var newName and newImage
   Campground.create(newCampground, function(err, newlyCreated){ //Create new campground and save to database
      if(err){
         console.log(err);
      } else {
        res.redirect("/campgrounds");  //redirect back to campground get page 
      }
   });

   
   
});


//NEW route
app.get("/campgrounds/new", function(req, res){
  
   res.render("campgrounds/new.ejs");
});


//SHOW ROUTE - shows detail info on selected campground
app.get("/campgrounds/:id", function(req, res){
   
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ //find campground with provided ID, then show template.
      if(err){
         console.log(err);
      } else {
         res.render("campgrounds/show", {campground: foundCampground});
         }
   });
   
});

//======================
//COMMENTS ROUTES

//NEW route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){ //middleware func to check if is logged in
   Campground.findById(req.params.id, function(err, campground){
      if(err){
         console.log();
         
      } else{
         res.render("comments/new", {campground: campground});
      }
   });
});

//COMMENTS
app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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
               //connect new comment to campground
               campground.comments.push(comment)
               campground.save();
               res.redirect("/campgrounds/" + campground._id);
              }
         });
         }
   });
});


//================
//AUTH ROUTES

app.get("/register", function(req, res){
   res.render("register")
});

//Handle Sign up logic
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
   res.render("login");
})

//handle login logic
app.post("/login", passport.authenticate("local", {
   successRedirect:"/campgrounds",
   failureRedirect: "/login"
}),function(req, res){
  
});

//LOGOUT ROUTE
app.get("/logout", function(req, res){
   req.logOut();//method comes from packages
   res.redirect("/campgrounds");
})

//loged in checked
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   };
   res.redirect("/login");
}


app.listen(3000, function(){
   console.log("In Action");
   
});