const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/timer.html');
});

const pomodoroTime = {"mode":0,"min":0,"sec":10}
const breakTime = {"mode":1,"min":0,"sec":05}

let timeLeft = {"mode":0,"min":pomodoroTime.min,"sec":pomodoroTime.sec};

console.log('started');

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


const myTimer = setInterval(countdown,1000);
function countdown(){
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
        //io.emit('timer',timeLeft.min,timeLeft.sec);
        io.emit('setup',timeLeft);
        
    }        
}


io.on('connection', (socket) => {

    console.log('a user connected !');
    io.emit('setup',timeLeft);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
});

http.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});