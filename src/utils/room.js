const rooms = [];

const findRoom = (roomID) =>{
    return rooms.find(r => r.id == roomID);
}

//set the counter to a given stage(work, short break or long break).
const setPomodoroState = (room,stateIndex) =>{
    room.timeLeft.state = room.pomodoro[stateIndex].state;
    room.timeLeft.min = room.pomodoro[stateIndex].time[0];
    room.timeLeft.sec = room.pomodoro[stateIndex].time[1];
}

const createRoom = (roomID) => {
    room = {
        "id": roomID,
        "started": false,
        "autostart": false,
        "counter": 0,
        "pomodoro": [
            { 
                "state": "work",
                "time": [0,5]
            },
            {
                "state": "shortBreak",
                "time": [0,5]
            },
            {
                "state": "longBreak",
                "time": [0,5]
            }
        ],
        "timeLeft":{},
        "countdown": "",
        "users":[]
    }
    setPomodoroState(room,0);
    rooms.push(room);
    return room;
}

/**
 * search a room and return it. If the room is not found, call a function to create a new room.
 * @param {id to be searched} roomID 
 * @returns the room needed, whether is a new or existing one
 */
const getRoom = (roomID) => {
    let room = findRoom(roomID);
    if(!room) room = createRoom(roomID);
    return room;
}

const getRoomBySocketID = (socketID) => {
    return rooms.find(room => room.users.indexOf(socketID) != -1 ? room : "" )
}

const pauseTimer = (room) => {
    if(room && room.started){
        clearInterval(room.countdown);
        room.started = false;
    }
}

const resetTimer = (room) =>{
    if(room){
        pauseTimer(room);
        setPomodoroState(room,0);
        room.counter = 0;
    }
}

const removeRoom = (room) => {
    rooms.splice(rooms.indexOf(room),1);
    resetTimer(room)
}

//handle timer when a pomodoro is complete
const handlePomodoroChange = (room) => {
    let stateIndex = 0; // 0 - Work; 1 - Short Break; 2 - Long Break; 
    
    if(!room.autostart) pauseTimer(room);

    if(room.counter == 3 && room.timeLeft.state == "work"){
        room.counter = 0;
        stateIndex = 2;
    }
    else if(room.counter < 3 && room.timeLeft.state == "work"){
        room.counter++;
        stateIndex = 1;
    }
    return setPomodoroState(room,stateIndex);
}

module.exports = {
    getRoom,
    getRoomBySocketID,
    resetTimer,
    removeRoom,
    handlePomodoroChange
}