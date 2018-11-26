var mongoose = require("mongoose"),
passLocMon = require("passport-local-mongoose"),

UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passLocMon);
module.exports = mongoose.model("User", UserSchema);