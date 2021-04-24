const rooms = [];

const findRoom = (roomID) =>{
    return rooms.find(r => r.id == roomID);
}

const configureRoomTimer = (room) =>{
    room.timeLeft.state = room.pomodoro[0].state;
    room.timeLeft.min = room.pomodoro[0].time[0];
    room.timeLeft.sec = room.pomodoro[0].time[1];
}

const getRoom = (roomID) => {
    let room = findRoom(roomID);
    if(!room){
        room = {
            "id": roomID,
            "started": false,
            "counter": 0,
            "pomodoro": [
                { 
                    "id": 0,
                    "state": "work",
                    "time": [0,10]
                },
                {
                    "id": 1,
                    "state": "shortBreak",
                    "time": [0,5]
                },
                {
                    "id": 2,
                    "state": "longBreak",
                    "time": [0,2]
                }
            ],
            "timeLeft":{},
            "countdown": "",
            "users":[]
        }
        configureRoomTimer(room);
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

    if(room.counter == 3 && room.timeLeft.state == "work"){
        //LONG BREAK
        room.counter = 0;
        room.timeLeft.state = room.pomodoro[2].state;
        room.timeLeft.min = room.pomodoro[2].time[0];
        room.timeLeft.sec = room.pomodoro[2].time[1];
    }else{
        if(room.timeLeft.state == "work"){
            //SHORT BREAK
            room.counter++;
            room.timeLeft.state = room.pomodoro[1].state;
            room.timeLeft.min = room.pomodoro[1].time[0];
            room.timeLeft.sec = room.pomodoro[1].time[1];

        }else{
            //WORK TIME
            room.timeLeft.state = room.pomodoro[0].state;
            room.timeLeft.min = room.pomodoro[0].time[0];
            room.timeLeft.sec = room.pomodoro[0].time[1];
        }
    }
}

module.exports = {
    getRoom,
    getRoomBySocketID,
    resetTimer,
    removeRoom,
    handlePomodoroChange
}