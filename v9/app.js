var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    pasLocMon = require("passport-local-mongoose"),
    seedDB  = require("./seeds"),
    User  = require("./models/user"),
    mongoose = require("mongoose");
    
   // requiring routes 
var campRoutes = require("./routes/campgrounds"),
    commRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost:27017/Yelp_Camp_9", {useNewUrlParser: true});
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

// seedDB(); seed the Data Base

// middleware for comments
function loggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/comments" ,commRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCame v9 Server is running...");
});