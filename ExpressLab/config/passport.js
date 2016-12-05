// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

// expose this function to our app using module.exports
exports.init = function(passport) {

    // config/passport.js


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                return done(err);
            }
            //if it is a touchID login
            else if (email === "touchIDAuthentification") {
                console.log("password from request", req.body.password);
                let password = req.body.password;
                User.byGUID(req.body.guid, function(err, rou) {
                    if (rou[0].serverToClientToken == password && rou[0].waitingToBeAuthenticated == true /* add touch id check*/) {
                        console.log("inside",rou);
                        rou[0].waitingToBeAuthenticated = false;
                        rou[0].serverToClientToken = "";
                        rou[0].clientAuthToken = "";
                        rou[0].touchIDSession = "";
                        rou[0].save(function(err) {
                            if (err)
                                throw err;
                            console.log('super test', rou);
                            //return done(null, rou[0]);
                            User.findOne({ '_id' :  rou[0]._id }, function(err, user) {
                                return done(null, user);
                            });
                        });
                        
                        // return done(null, rou[0]);
                    }
                });
                //console.log(rou);
            }

            // if no user is found, return the message
            else if (!user && email != "touchIDAuthentification") {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
            // if the user is found but the password is wrong
            else if (email != "touchIDAuthentification" && !user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            else if (email != "touchIDAuthentification") {
                user.waitingToBeAuthenticated = true
                user.save(function(err) {
                        if (err)
                            throw err;
                });
                return done(null, user);
            }
            else {
                console.log("I dont know what is happening");
            }
        });

    }));

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else if (email === "touchIDAuthentification") {
                return done(null, false, req.flash('signupMessage', 'Not a valid username'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.waitingToBeAuthenticated = false;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

};

