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

const rooms = [
    {
        "id": "general",
        "started": false,
        "timeLeft":{
            "mode": pomodoro[0].id,
            "min": pomodoro[0].time[0],
            "sec": pomodoro[0].time[1],
        },
        "countdown": ""
    },
]


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

const countdown = (io,room) =>{
    
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
        room.timeLeft = handlePomodoro(room.timeLeft);
        io.to(room).emit('endedTime',room.timeLeft);
    } 
}


const createRoom = (roomID) => {
    let room = rooms.find(r => r.id == roomID)
    if(!room){
        room = {
            "id": roomID,
            "started": false,
            "timeLeft":{
                "mode": pomodoro[0].id,
                "min": pomodoro[0].time[0],
                "sec": pomodoro[0].time[1],
            },
            "countdown": ""
        }
        rooms.push(room);
    }
    return room;
}

const joinRoom = (io,socket,roomID) =>{
    let room = createRoom(roomID);
    socket.join(room);
    console.log("User " + socket.id + " joined "+ room.id );
    io.to(room).emit('setup',room.timeLeft);
}

const startTimer = (io,roomID) =>{
    let room = createRoom(roomID);
    if(!room.started){
        room.countdown = setInterval(()=>{countdown(io,room)},1000)
        room.started = 1;
    }
}

const pauseTimer = (io,roomID) =>{
    let room = createRoom(roomID);
    if(room.started){
        //room.countdown
        clearInterval(room.countdown);
        room.started = false;
    }
}


module.exports = {
    joinRoom,
    createRoom,
    startTimer,
    pauseTimer
}

