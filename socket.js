// const express = require('express');
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const io = require("socket.io")(server, {
//     cors: {
//         origin: "*",
//         methods: ['GET', 'POST']
//     }
// });

// io.on('connection', (socket) => {
//     const roomId = 'myroom';
//     console.log('a user connected ' + roomId);
//     // join a room
//     socket.to('myroom').emit('controller_data',);

//     socket.join(roomId);
// });

// server.listen(6000, console.log(`Server listening on port ${6000}`))
// module.exports = io;