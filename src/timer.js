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

const countdown = (room) =>{
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

let rooms = [
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
    {
        "id": "room2",
        "started": 0,
        "timeLeft":{
            "mode": pomodoro[0].id,
            "min": pomodoro[0].time[0],
            "sec": pomodoro[0].time[1],
        },
        "countdown": ""
    }
]

const createRoom = (roomID) => {
    const room = {
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
    return room;
}

exports.setUpTimer = (server) => {
    io = socketio(server);
    io.on('connection', (socket) => {

        console.log('a user connected !');

        socket.on('joinRoom',(roomID)=>{
            roomID = roomID.toLowerCase();
            let room = rooms.find(r => r.id == roomID)
            if(!room) room = createRoom(roomID);
            
            socket.join(room);
            console.log("User " + socket.id + " joined "+ room.id );
            io.to(room).emit('setup',room.timeLeft);
            
            
            if(!room.started){
                room.countdown = setInterval(()=>{countdown(room)},1000)
                room.started = 1;
            }

        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        
    });

    
}


//exports.initTimer = () => setInterval(countdown,1000);
