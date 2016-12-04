var socket = io();
var user = require('../models/user');



io.on('connection', function(socket) {

socket.on('init_connect', function(paramaters){

    console.log('connect.js javascript file... nothing should print unless iOS app running and matching socked added')

    console.log(paramaters);
    console.log('Receiving params from iOS');

    //testing
    console.log(user.local.email);
    // in this function, once I receive params from iOS (iPhone id, or some token for association)
    // update the user model. post call? some function / action to do so 
    // once action is completed, begin socket.on('connect_2') to inform iOS application connection is complete.
    // also update connection page that a connection has been made to an iPhone device 
});

socket.emit('init_connect', user) {
    console.log('hit');
}

socket.on('connect_2', function {
    io.sockets.emit("")
});

});