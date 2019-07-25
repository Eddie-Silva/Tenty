let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let methodOveride = require("method-override");
let Campground = require("./models/campground");
let Comment = require("./models/comment");
let seedDB = require("./seeds");
let User = require("./models/user");

//requiring routes
let commentRoutes = require("./routes/comments");
let campgroundRoutes = require("./routes/campgrounds");
let indexRoutes = require("./routes/index");



//Configuration
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true}); //connects to mongoose and create database
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public")); //for CSS liniking
app.use(methodOveride("_method")); //for UPDATE methods

//seedDB();

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
   res.locals.currentUser = req.user; //'currentUser' available to every templete
   next();
});


app.use("/", indexRoutes); //use these 3 route files
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(3000, function(){
   console.log("In Action");
   
});