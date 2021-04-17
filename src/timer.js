const socketio = require('socket.io');
const { createRoom, countdown } = require('./utils/rooms')

let io;

exports.setUpTimer = (server) => {
    io = socketio(server);
    io.on('connection', (socket) => {

        console.log('a user connected !');

        socket.on('joinRoom',(roomID)=>{
            roomID = roomID.toLowerCase();
            room = createRoom(roomID);
            
            socket.join(room);
            console.log("User " + socket.id + " joined "+ room.id );
            io.to(room).emit('setup',room.timeLeft);
            
            
            if(!room.started){
                room.countdown = setInterval(()=>{countdown(io,room)},1000)
                room.started = 1;
            }
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        
    });
}


//exports.initTimer = () => setInterval(countdown,1000);
