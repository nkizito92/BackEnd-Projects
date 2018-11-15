var mongoose = require("mongoose"),
Comment = require("./models/comment"),
Campground = require("./models/campground");

var data = [
        {
            name: "Wolves",
            image: "https://as1.ftcdn.net/jpg/00/73/12/86/500_F_73128656_yEHDF5Op2vsu3feO9b2ZEDkdcp4bkewZ.jpg",
            description: "Woof Woof"
        },
        {
            name: "Blue wolf",
            image: "https://as1.ftcdn.net/jpg/00/28/22/70/500_F_28227019_6kjyhgShTYW9qSfmt0537t8VZkbP4Zg0.jpg",
            description: "Grrrrrrrrr Woof"
        },
        {
            name: "Lion",
            image: "https://images.pexels.com/photos/68421/pexels-photo-68421.jpeg?auto=compress&cs=tinysrgb&h=350",
            description: "Roar!!!"
        }
    ];
function seedDB(){
   //Remove all campgrounds
   Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "What a Scary Wolf",
                                author: "Jake"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;