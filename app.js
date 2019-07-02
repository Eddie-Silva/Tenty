let express = require("express");
let app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
   res.render("landing");
})

app.get("/campgrounds", function(req, res){
   let campgrounds = [
      {name: "lake krystal", image: "https://farm1.staticflickr.com/3/6059001_f8cf6187c6_m.jpg"},
      {name: "yellow pine", image: "https://farm5.staticflickr.com/4309/36129213511_06e02f5b4a_m.jpg"},
      {name: "mount fire", image: "https://farm4.staticflickr.com/3103/2677233699_2268dbe1ea_m.jpg"}
   ]
   res.render("campgrounds", {campgrounds: campgrounds})
})

app.listen(3000, function(){
   console.log("In Action");
   
})