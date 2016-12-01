var express  = require('express');
var app      = express();
var http = require('http').Server(app);
var port     = process.env.PORT || 8080;
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var fs = require("fs");
var path = require("path");

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport').init(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
//Load all the routes in the directory
fs.readdirSync('./routes').forEach(function(file) {
	if (path.extname(file) =='.js') {
		require('./routes/' + file).init(app, passport);
	}
});

// Handle static files
app.use(express.static('public'));

//Set the views directory
app.set('views',__dirname + '/views');


//if there is an error, will redirect to  apage showing it
app.use(function(request, response) {
	var message = 'Error, did not understand path' + request.path;
	response.status(404).render('misc/error',{'message': message});
})

//gets the socket logic
require('./socketio/serverSocket.js').init(io);


// launch ======================================================================
http.listen(port, function(){
  console.log('listening on *:8080');
});
console.log('The magic happens on port ' + port);