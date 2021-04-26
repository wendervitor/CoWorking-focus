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
                    "state": "work",
                    "time": [25,0]
                },
                {
                    "state": "shortBreak",
                    "time": [5,0]
                },
                {
                    "state": "longBreak",
                    "time": [15,0]
                }
            ],
            "timeLeft":{},
            "countdown": "",
            "users":[]
        }
        setPomodoroState(room,0);
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