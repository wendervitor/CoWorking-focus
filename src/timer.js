const socketio = require('socket.io');
const { joinRoom } = require('./utils/rooms')

let io;

exports.setUpTimer = (server) => {
    io = socketio(server);
    io.on('connection', (socket) => {

        console.log('a user connected !');

        socket.on('joinRoom',(roomID)=>{
            roomID = roomID.toLowerCase();
            joinRoom(io,socket,roomID);
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        
    });
}


//exports.initTimer = () => setInterval(countdown,1000);
