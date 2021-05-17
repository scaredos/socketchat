const express = require('express'); // look for express in file

// Initialize app and server
const app = express();
const debug = false;
const port = 8080;
const server = app.listen(port, function(){
    if (debug) {
      console.log(`Listening on port ${port}`);
    }
    console.log('running');
});
const io = require("socket.io")(server, {
  allowEIO3: true // false by default
});

// Static files
app.use(express.static('html'));

// Socket setup
//const io = socket(server);
io.on('connection', function(socket){
    if (debug) {
      console.log('made socket connection', socket.id);
    }

    // Broadcast chat
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    // Broadcast typing
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
});
