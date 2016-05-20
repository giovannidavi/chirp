var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    sid: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now}
});

var postSchema = new mongoose.Schema({
    created_at: {type: Date, default: Date.now},
    created_by: String,
    text: String,
    category: String
});

userSchema.plugin(passportLocalMongoose);

//initialize  / register models which have specific schemas
mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);