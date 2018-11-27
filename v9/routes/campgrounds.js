var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");


router.get("/", function(req, res){
        
        Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
    
});

// CREATE route to create a new campground
router.post("/", loggedIn, function(req, res){
       var name = req.body.name,
       image =  req.body.image,
       description =  req.body.description,
       author = {
           id: req.user._id,
           username: req.user.username
       },
       newCampground = {name: name, image: image, description: description, author: author};
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
router.get("/new", loggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
    
});

// SHOW route 
router.get("/:id", function(req, res) {
    // find  the campgrounds with provide ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        
       if(err){
           console.log(err);
          
       } else {
           console.log(foundCampground);
         // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});  
       }
    });
    
} );

function loggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

}

module.exports = router;