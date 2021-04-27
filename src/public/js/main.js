const socket = io();

const timerElem = document.getElementById("timer");
const state = document.getElementById("title");
const form = document.getElementById('form');
const input = document.getElementById('input');
const video =  document.getElementById('video');
const beep = document.getElementById('beep');
const headerRoom = document.getElementById('headerRoom')


/**
 * Set the title and background color of the actual state of pomodoro 
 * @param {title of the actual pomodoro state} title 
 * @param {color of the actual pomodoro state} color 
 */
const changeBg = (title,color) => {
    state.innerHTML = title;
    document.body.style.backgroundColor = color;
}

/**
 * Format the visual of minutes or seconds (e.g. 9 -> 09)
 * @param {original time in seconds or minutes} time 
 * @returns time formatted
 */
const formatTime = (time) => time = time < 10 ? '0'+time : time;

/**
 * print the countdown into the DOM
 * @param {minutes} min 
 * @param {seconds} sec 
 */
const printCountdown = (min, sec) => {
    const actualTime = min + ":" + sec;
    timerElem.innerHTML = actualTime;
    document.title = actualTime +" "+ state.innerHTML
}

/**
 * A regex function to search for a specific query in a url
 * @param {name of query needed} name 
 * @returns value of query or null
 */
 function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * extract the video id from a YouTube URL (only the part after "v=") to embed in page
 * @param {YouTube url} url 
 * @returns video id
 */
 const extractVideoID = (url) =>{
    const splittedURL = url.split('/')
    if(splittedURL[2]=="youtu.be") return splittedURL[3].replace(/&/g,'?');
    else return splittedURL[3].substring(8).replace(/&/g,'?');
}

/**
 * Set the countdown and can change background color 
 * @param {current time} time 
 */
const setupCountdown = (time) =>{
    const workColor = "#b26c85";
    const breakTimeColor = "#85b26c";
    const longBreakColor = "#6c85b2"
    
    switch(time.state){
        case "work": 
            changeBg("Work time !",workColor);
        break;
        case "shortBreak":
            changeBg("Take a short break !",breakTimeColor);
        break;
        case "longBreak":
            changeBg("Take a long break !",longBreakColor);
        break;

    }
    headerRoom.innerHTML = "Room: " + roomID;
    printCountdown(formatTime(time.min),formatTime(time.sec));
}

//Form to embed YouTube video
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        video.src="https://www.youtube.com/embed/"+extractVideoID(input.value)
        input.value = '';
    }
});

const roomID = getUrlParameter("room");
socket.emit('room:joinRoom', roomID);




/* TIMER CONTROLLERS */
const startTimer = () => socket.emit('timer:start');

const pauseTimer = () => socket.emit('timer:pause');

const stopTimer = () => {
    if (confirm("Do you want to cancel the Pomodoro Counter?\n")) {
        socket.emit('timer:stop');    
    }
}

/* SOCKET LISTENERS */

socket.on('setup',time => setupCountdown(time));

socket.on('endedTime',time => {
    setupCountdown(time);
    beep.play();
});

socket.on('timer', (min,sec) => printCountdown(formatTime(min),formatTime(sec)));