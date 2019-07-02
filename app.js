let express = require("express");
let app = express();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

let campgroundsArray = [
   {name: "lake krystal", image: "https://farm1.staticflickr.com/3/6059001_f8cf6187c6_m.jpg"},
   {name: "yellow pine", image: "https://farm5.staticflickr.com/4309/36129213511_06e02f5b4a_m.jpg"},
   {name: "mount fire", image: "https://farm4.staticflickr.com/3103/2677233699_2268dbe1ea_m.jpg"}
]


app.get("/", function(req, res){
   res.render("landing");
})

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgroundsArray}) // takes the data from campgroundsArray and passes it as 'campgrounds' object to 'campgrounds.ejs
})

app.post("/campgrounds", function(req, res){

   //get data from form and add to campgrunds

   let newName = req.body.name; // the data of the field with the 'name' name
   let newImage = req.body.image; // the data of the field with the 'name' image
   let newCampground = {name: newName, image: newImage}; //makes a new {} with the propertie = to the var newName and newImage
   campgroundsArray.push(newCampground); // adds newCampground {} to campgrounds array

   
   res.redirect("/campgrounds");  //redirect back to campground get page
});

app.get("/campgrounds/new", function(req, res){
  
   res.render("new.ejs")
})

app.listen(3000, function(){
   console.log("In Action");
   
})