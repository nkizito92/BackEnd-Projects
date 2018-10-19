var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost:27017/Yelp_Camp", {useNewUrlParser: true});
app.use(bodyparser.urlencoded({extended: true}) );

app.set("view engine", "ejs");


app.get("/", function(req, res) {
   res.render("landing"); 
});

// First convention as a get to show you all campgrounds

// Index Route 
app.get("/campgrounds", function(req, res){
        
        Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
    
});



var campgroundSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        description: String
    }
    );
    
var Campground = mongoose.model("Campground", campgroundSchema);

/*Campground.create(
     {
         name: "green hill", 
         image: "https://farm1.staticflickr.com/185/425513497_cb449acc5d.jpg",
         description: "Nature, filled with trees and animal life"
         
     }
    , function(err, campground){
        if(err){
            console.log(err);
        } 
         else {
             console.log("New campground created");
             console.log(campground);
         }
    });*/

// CREATE route to create a new campground
app.post("/campgrounds", function(req, res){
       var name = req.body.name;
       var image =  req.body.image;
       var description =  req.body.description;
       var newCampground = {name: name, image: image, description: description};
       //Create new campground and save it
       Campground.create(newCampground, function(err, newCreation){
           {
              if(err){
                  console.log(err);
              } else {
                  //redirect back to campgrounds page DB
                  res.redirect("/campgrounds");
              }
           }
       });
    //get data from form and add to campgrounds array
    
});


// Third convention for REST to show the form that will send
// NEW - show form to create new campground 
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
    
});

// SHOW route 
app.get("/campgrounds/:id", function(req, res) {
    // find  the campgrounds with provide ID
    Campground.findById(req.params.id, function(err, foundCampground){
        
       if(err){
           console.log(err);
           
       } else {
         // render show template with that campground
            res.render("show", {campground: foundCampground});  
       }
    });
    
} );

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCame Server is running...");
});