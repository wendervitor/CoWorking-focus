const socketio = require('socket.io');
let io;

const registerRoomHandlers = require("./eventHandlers/roomHandler");

exports.setUpTimer = (server) => {
    io = socketio(server);
    io.on('connection', (socket) => {
        registerRoomHandlers(io,socket);
    });
}
