const mongoose = require('mongoose');

mongoose.connect("", {
   useNewUrlParser: true,
   useCreateIndex: true
})
   .then(db => console.log("DB is connected"))
   .catch(err => console.error(err));