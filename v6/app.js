var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    pasLocMon = require("passport-local-mongoose"),
    Campground = require("./models/campground"),
    seedDB  = require("./seeds"),
    User  = require("./models/user"),
    Comment = require("./models/comment"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost:27017/Yelp_Camp_6", {useNewUrlParser: true});
app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "I am the best!!!",
    resave: false,
    saveUninitialized: false
}));
// =================
// passport config
// =================
app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
    next();
});

app.set("view engine", "ejs");

app.get("/", function(req, res) {
   res.render("landing"); 
});

seedDB();

// First convention as a get to show you all campgrounds

// Index Route 
app.get("/campgrounds", function(req, res){
        
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
app.post("/campgrounds", function(req, res){
       var name = req.body.name,
       image =  req.body.image,
       description =  req.body.description,
       newCampground = {name: name, image: image, description: description};
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
    res.render("campgrounds/new.ejs");
    
});

// SHOW route 
app.get("/campgrounds/:id", function(req, res) {
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
//=======================
//COMMENTS ROUTES
//=======================

app.get("/campgrounds/:id/comments/new", loggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

// CREATE  NEW COMMENT 

app.post("/campgrounds/:id/comments", loggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err)
            res.redirect("/campgrounds");
        } else {
            console.log(req.body.comment)
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                    console.log(err);
                } else {
                    console.log(comment)
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
                }
            }); 
        }
    });
});

// Auth Routes
app.get("/register", function(req, res){
    res.render("register");
});

// Sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
User.register(newUser, req.body.password, function(err, user){
    if(err){
        console.log(err);
        return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
        res.redirect('/campgrounds');
    });
        
});
});
 
// login logic
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local",
{successRedirect: "/campgrounds", 
     failureRedirect: "/login"
    }), function(req, res) {
});

// logout Route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

// middleware for comments
function loggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCame v6 Server is running...");
});