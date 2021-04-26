const { handlePomodoroChange, resetTimer } = require('../utils/room')
module.exports = (io, socket, room) => {

    //Control the countdown timer and emit the state of timer.
    const countdown = () =>{
        if(room.timeLeft.sec != 0){
            room.timeLeft.sec -= 1;       
            io.to(room).emit('timer',room.timeLeft.min,room.timeLeft.sec);
        }
        else if(room.timeLeft.sec == 0 && room.timeLeft.min != 0){
            room.timeLeft.min -= 1;
            room.timeLeft.sec = 59;
            io.to(room).emit('timer',room.timeLeft.min,room.timeLeft.sec);   
        }
        else if(room.timeLeft.sec == 0 && room.timeLeft.min == 0){
            handlePomodoroChange(room);
            io.to(room).emit('endedTime',room.timeLeft);
        } 
    }
    
    const startTimer = () => {
        if(room && !room.started){
            room.countdown = setInterval(countdown,1000)
            room.started = true;
        }
    }

    const pauseTimer = () => {
        if(room && room.started){
            clearInterval(room.countdown);
            room.started = false;
        }
    }

    const stopTimer = () => {
        if(room){
            resetTimer(room);
            io.to(room).emit('setup',room.timeLeft);
        }
    }
    
    socket.on('timer:start', startTimer);
    socket.on('timer:pause', pauseTimer);
    socket.on('timer:stop', stopTimer);
}