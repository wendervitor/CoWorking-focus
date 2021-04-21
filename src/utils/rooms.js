const rooms = [
    {
        "id": "general",
        "started": false,
        "pomodoro": [
            { 
                "id": 0,
                "state": "work",
                "time": [0,10]
            },
            {
                "id": 1,
                "state": "break",
                "time": [0,5]
            }
        ],
        "timeLeft":{
            "mode": 0,
            "min": 0,
            "sec": 10,
        },
        "countdown": "",
        "users": []
    },
]


const handlePomodoro = (room) => {
    
    if(room.timeLeft.mode){
        room.timeLeft.min = room.pomodoro[0].time[0];
        room.timeLeft.sec = room.pomodoro[0].time[1];
    }
    else{
        room.timeLeft.min = room.pomodoro[1].time[0];
        room.timeLeft.sec = room.pomodoro[1].time[1];
    }
    room.timeLeft.mode = !room.timeLeft.mode;
    return room;
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
        room = handlePomodoro(room);
        io.to(room).emit('endedTime',room.timeLeft);
    } 
}

const createRoom = (roomID) => {
    let room = rooms.find(r => r.id == roomID)
    if(!room){
        room = {
            "id": roomID,
            "started": false,
            "pomodoro": [
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
            ],
            "timeLeft":{
                "mode": 0,
                "min": 50,
                "sec": 0,
            },
            "countdown": "",
            "users":[]
        }
        rooms.push(room);
    }
    return room;
}

const joinRoom = (io,socket,roomID) => {
    let room = createRoom(roomID);
    room.users.push(socket.id);
    socket.join(room);
    console.log("User " + socket.id + " joined "+ room.id );
    io.to(room).emit('setup',room.timeLeft);
}

const startTimer = (io,roomID) => {
    let room = createRoom(roomID);
    if(!room.started){
        room.countdown = setInterval(()=>{countdown(io,room)},1000)
        room.started = 1;
    }
}

const pauseTimer = (roomID) => {
    let room = createRoom(roomID);
    if(room.started){
        clearInterval(room.countdown);
        room.started = false;
    }
    return room;
}

const clearTime = (room) =>{
    if(room){
        room.timeLeft.mode = room.pomodoro[0].id;
        room.timeLeft.min = room.pomodoro[0].time[0];
        room.timeLeft.sec = room.pomodoro[0].time[1];
    }
}

const stopTimer = (io,roomID) => {
    let room = pauseTimer(roomID);
    clearTime(room);
    io.to(room).emit('setup',room.timeLeft);
}

const removeRoom = (room) =>{
    rooms.splice(rooms.indexOf(room),1);
    console.log(rooms);
}

const handleUserLeft = (socket) =>{
    room = rooms.find(room =>{
        return room.users.indexOf(socket.id) != -1 ? room : "";
    })
    if(room){
        room.users.splice(room.users.indexOf(socket.id),1);
        if(room.users.length === 0){
            clearTime(room);
            console.log("alou");
            removeRoom(room);
        }
    }
}


module.exports = {
    joinRoom,
    createRoom,
    startTimer,
    pauseTimer,
    stopTimer,
    handleUserLeft
}