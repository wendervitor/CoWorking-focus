const socketio = require('socket.io');
let io;

const pomodoro = [
    { 
        "id": 0,
        "state": "work",
        "time": [50,0]
    },
    {
        "id": 1,
        "state": "break",
        "time": [10,0]
    }
];

let timeLeft = {
    "mode": pomodoro[0].id,
    "min": pomodoro[0].time[0],
    "sec": pomodoro[0].time[1],
};


const handlePomodoro = (time) => {
    
    if(time.mode){
        time.min = pomodoro[0].time[0];
        time.sec = pomodoro[0].time[1];
    }
    else{
        time.min = pomodoro[1].time[0];
        time.sec = pomodoro[1].time[1];
    }
    time.mode = !time.mode;
    return time;
}

const countdown = () =>{
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
        io.emit('endedTime',timeLeft);
    } 
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

exports.initTimer = () => setInterval(countdown,1000);
