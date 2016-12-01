exports.init = function(io) {

    var clients = 0; 

    io.on('connection', function(socket){
        console.log('a user connected');

        // ++clients; 
        // socket.broadcast.emit('users_count', clients);
        // io.sockets.emit('users_count', clients);

        // Below line triggered
        

        io.sockets.emit('handShake', 'This is working');
        socket.broadcast.emit('handShake', 'Do broadcast instead');
        console.log(clients);

        socket.on('lost connection', function(){
            console.log('user lost connection');
        });

        // note capitalization of both handshake functions!!
        socket.on('handShake', function(){
            console.log('Getting HandShake from iOS');
        });

        socket.on('handshake', function(){
            console.log('Getting Handshake from iOS');
            io.sockets.emit("backFromHandshake", "Some Data");
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
            // --clients;
            // console.log(clients);
        });
    });
}