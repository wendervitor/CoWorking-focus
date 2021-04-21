const socketio = require('socket.io');
const { startTimer, joinRoom, pauseTimer,stopTimer, handleUserLeft } = require('./utils/rooms')

let io;

exports.setUpTimer = (server) => {
    io = socketio(server);
    io.on('connection', (socket) => {

        console.log('a user connected !');

        socket.on('joinRoom',(roomID)=>{
            roomID = roomID.toLowerCase();
            joinRoom(io,socket,roomID);
            
            socket.on('start',()=>{
                console.log("Start Timer");
                startTimer(io,roomID);
            });
            
            socket.on('pause',()=>{
                console.log("Pause Timer");
                pauseTimer(roomID);
            });
            
            socket.on('stop',()=>{
                console.log("Stop Timer");
                stopTimer(io,roomID);
            });
        });
        socket.on('disconnect', () => {
            handleUserLeft(socket)
            console.log('user disconnected');
        });
        
    });
}
