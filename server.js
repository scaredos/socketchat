// Express web server for backend
const express = require('express');
// Socket.io for web socket interaction
const socket = require('socket.io');

// Initilize app
const app = express();

let port = 8080; // define port for easy change

const server = app.listen(port, function() {
  console.log('socket open on port ' + port)
});

// Static files for web application
app.use(express.static('html'));

// Socket handler
const io = socket(server);

io.on('connection', function(socket) {
  if (debug) {
    console.log('socket connection created: ', socket.id);
  }
  
  // Implement chat feature
  socket.on('chat', function(data) {
    io.sockets.emit('chat', data);
  });

  // Implement typing feature
  socket.on('typing', function(data) {
    socket.broadcast.emit('typing', data);
  });
})
