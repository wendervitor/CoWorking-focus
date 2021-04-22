const rooms = [];

const findRoom = (roomID) =>{
    return rooms.find(r => r.id == roomID);
}

const getRoom = (roomID) => {
    let room = findRoom(roomID);
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

const getRoomBySocketID = (socketID) => {
    return rooms.find(room => room.users.indexOf(socketID) != -1 ? room : "" )
}

const resetTimer = (room) =>{
    if(room){
        clearInterval(room.countdown);
        room.started = false;
        room.timeLeft.mode = room.pomodoro[0].id;
        room.timeLeft.min = room.pomodoro[0].time[0];
        room.timeLeft.sec = room.pomodoro[0].time[1];
    }
}

const removeRoom = (room) => {
    rooms.splice(rooms.indexOf(room),1);
    resetTimer(room)
}

const handlePomodoroChange = (room) => {
    
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

module.exports = {
    getRoom,
    getRoomBySocketID,
    resetTimer,
    removeRoom,
    handlePomodoroChange
}