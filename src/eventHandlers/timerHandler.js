const { setPomodoroState, resetTimer, handlePomodoroTimer } = require('../utils/room')
module.exports = (io, socket, room) => {
    
    const countdown = () =>{
        io.to(room).emit(handlePomodoroTimer(room),room.timeLeft);
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

    const applySettings = (settings) =>{
        room.autostart = settings.isAutoStarted;
        room.pomodoro[0].time[0]=settings.pomodoroMin;
        room.pomodoro[1].time[0]=settings.shortBreakMin;
        room.pomodoro[2].time[0]=settings.longBreakMin;
        if(!room.started){
            const index = room.pomodoro.findIndex(pomodoro => pomodoro.state === room.timeLeft.state);
            setPomodoroState(room,index);
            io.to(room).emit('setup',room.timeLeft);
        }
    }
    
    socket.on('timer:start', startTimer);
    socket.on('timer:pause', pauseTimer);
    socket.on('timer:stop', stopTimer);
    socket.on('timer:settings',applySettings)
}