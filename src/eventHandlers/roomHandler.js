const { getRoom, getRoomBySocketID, removeRoom } = require('../utils/room')
const registerTimerHandlers = require("./timerHandler");
module.exports = (io, socket) => {
    
    const joinRoom = (roomID) => {
        if(roomID){
            let room = getRoom(roomID.toLowerCase());
            room.users.push(socket.id);
            socket.join(room);
            console.log("User " + socket.id + " joined room " + room.id );
            registerTimerHandlers(io,socket,room);
            io.to(room).emit('setup',room.timeLeft);
        }
    }

    const handleUserLeft = () =>{
        let room = getRoomBySocketID(socket.id);
        if(room){
            console.log("User " + socket.id + " left room " + room.id );
            room.users.splice(room.users.indexOf(socket.id),1);
            if(room.users.length === 0){
                removeRoom(room);
            }
        }
    }
  
    socket.on("room:joinRoom",joinRoom);
    socket.on('disconnect', handleUserLeft);
}