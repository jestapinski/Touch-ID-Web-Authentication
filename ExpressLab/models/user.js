//models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        apple_mac    : String, 
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.generateHashForAppleMac = function(apple_mac) {
    return bcrypt.hashSync(apple_mac, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.validPasswordForAppleMac = function(apple_mac) {
    return bcrypt.compareSync(apple_mac, this.local.apple_mac);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);