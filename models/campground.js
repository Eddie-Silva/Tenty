let mongoose = require("mongoose");

//SCHEMA SETUP 
let campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   comments: [
      {
         type:mongoose.Schema.Types.ObjectId, //Assosiate comment to campground through comment 'id'
         ref: "Comment" //name of the model
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema); //make a model that uses schema from 'campgroundSchema
