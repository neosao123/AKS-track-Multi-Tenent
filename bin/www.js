#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('socket-server:server');
var http = require('http');
const socketIo = require("socket.io");
const cors = require("cors");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);
app.use(cors());
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


var rooms = new Set();

io.on('connection', (socket) => {
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client Disconnected")
  });

  socket.on("host-room", (roomId) => {
    rooms.add(roomId);
    socket.join(roomId);
    socket.emit("room-created", roomId);
    console.log('New room hosted => ', roomId);
  });

  socket.on("join-room", (roomId) => {
    if (!rooms.has(roomId)) {
      socket.emit("room-not-found");
      return;
    }
    socket.join(roomId);
    socket.emit('user-joined', roomId);
    console.log('New user joined the room => ', roomId);
  });

  socket.on("message", (roomId, message) => {
    io.to(roomId).emit('message', message);
    console.log("Room => ", roomId, " has Received message => ", message);
  });

});



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

console.log("Server Listening on port :", port);


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
