const rooms = [];

const findRoom = (roomID) =>{
    return rooms.find(r => r.id == roomID);
}

// "initial" settings to start pomodoro
const configureRoomTimer = (room) =>{
    room.timeLeft.state = room.pomodoro[0].state;
    room.timeLeft.min = room.pomodoro[0].time[0];
    room.timeLeft.sec = room.pomodoro[0].time[1];
}

/**
 * search a room and return it. If the room is not found, create a new one and return it.
 * @param {id to be searched} roomID 
 * @returns the room needed, whether is a new or existing one
 */
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
                    "time": [25,0]
                },
                {
                    "id": 1,
                    "state": "shortBreak",
                    "time": [5,0]
                },
                {
                    "id": 2,
                    "state": "longBreak",
                    "time": [15,0]
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


//handle timer when a pomodoro is complete
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