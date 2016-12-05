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
    clientAuthToken: String,
    serverToClientToken: String,
    lastSaltSentToken: String,
    touchIDSession: String,
    socketID: String
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


userSchema.statics.byUser = function(email, cb) {
    return this.find({ 'local.email': email}, 'id waitingToBeAuthenticated serverToClientToken touchIDSession clientAuthToken local.phone_identifier', cb);
};

userSchema.statics.byClientToken = function(token, cb) {
    return this.find({ serverToClientToken: token}, 'id waitingToBeAuthenticated serverToClientToken socketID', cb);
};

userSchema.statics.byGUID = function(guid, cb) {
    return this.find({ clientAuthToken: guid}, 'id waitingToBeAuthenticated serverToClientToken touchIDSession', cb);
};

userSchema.statics.byPhone_identifier = function(token, cb) {
    return this.find({ 'local.phone_identifier': token}, 'id waitingToBeAuthenticated serverToClientToken touchIDSession clientAuthToken local.phone_identifier', cb);
};

// userSchema.statics.clearTokens = function(email, cb) {
//     this.findOneAndUpdate({ 'local.email': email})
//     return this.find({ 'local.email': email}, 'id waitingToBeAuthenticated', cb);
// };


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);