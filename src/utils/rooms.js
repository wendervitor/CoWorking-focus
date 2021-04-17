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
        "started": 0,
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

exports.countdown = (io,room) =>{
    
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


exports.createRoom = (roomID) => {
    let room = rooms.find(r => r.id == roomID)
    if(!room){
        room = {
            "id": roomID,
            "started": 0,
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

