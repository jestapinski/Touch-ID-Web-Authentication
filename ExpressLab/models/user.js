//models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email       	 	: String,
        password     		: String, 
        phone_identifier	: String
    },
    waitingToBeAuthenticated: Boolean,
    machineAuthToken: String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


routineSchema.statics.byUser = function(email, cb) {
    return this.find({ 'local.email': emailuserId}, 'id waitingToBeAuthenticated', cb);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);