let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let passport = require("passport");
let flash = require("connect-flash");
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

//connects to mongoose and create database
//mongoose.connect("mongodb://localhost/campout");
mongoose.connect("mongodb+srv://dbUser:illhero@cluster0-bjikw.mongodb.net/test?retryWrites=true&w=majority", {
   useNewUrlParser: true,
   useCreateIndex: true
}).then(() => {
   console.log("connected to DB");
   
}).catch(err => {
   console.log("ERROR:", err.message);
   
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public")); //for CSS liniking
app.use(methodOveride("_method")); //for UPDATE methods
app.use(flash());

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
   res.locals.error = req.flash("error"); 
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes); //use these 3 route files
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



const port = process.env.PORT || 3000;
const ip = process.env.IP || "127.0.0.1";
app.listen(port,function(){
    console.log("Server has started .... at port "+ port+" ip: "+ip);
});