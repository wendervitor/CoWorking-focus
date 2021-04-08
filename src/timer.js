const socketio = require('socket.io');

let io;

const pomodoroTime = {"mode":0,"min":25,"sec":0}
const breakTime = {"mode":1,"min":5,"sec":0}

let timeLeft = {"mode":0,"min":pomodoroTime.min,"sec":pomodoroTime.sec};

const handlePomodoro = (time) => {
    
    if(time.mode){
        time.min = pomodoroTime.min;
        time.sec = pomodoroTime.sec;
    }
    else{
        time.min = breakTime.min;
        time.sec = breakTime.sec;
    }
    time.mode = !time.mode;
    return time;
}


exports.setUpTimer = (server) => {
    io = socketio(server);
    
    io.on('connection', (socket) => {

        console.log('a user connected !');
        io.emit('setup',timeLeft);
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        
    });
}

exports.countdown = () =>{
    if(timeLeft.sec != 0){
        timeLeft.sec -= 1;       
        io.emit('timer',timeLeft.min,timeLeft.sec);
    }
    else if(timeLeft.sec == 0 && timeLeft.min != 0){
        timeLeft.min -= 1;
        timeLeft.sec = 59;
        io.emit('timer',timeLeft.min,timeLeft.sec);   
    }
    else if(timeLeft.sec == 0 && timeLeft.min == 0){
        timeLeft = handlePomodoro(timeLeft);
        io.emit('setup',timeLeft);
    } 
}