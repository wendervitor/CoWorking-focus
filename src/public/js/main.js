const socket = io();

const timerElem = document.getElementById("timer");
const state = document.getElementById("title");
const form = document.getElementById('form');
const input = document.getElementById('input');
const video =  document.getElementById('video');
const beep = document.getElementById('beep');


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const roomID = getUrlParameter("room");

socket.emit('joinRoom', roomID);



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
    const workColor = "#eb534d";
    const breakTimeColor = "#31d686";
    if(!time.mode) changeBg("Work time !",workColor);
    else changeBg("Have a break !",breakTimeColor);
    printCountdown(formatTime(time.min),formatTime(time.sec));
}

const startTimer = () => {
    socket.emit('start');
}

const pauseTimer = () => {
    socket.emit('stop');
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        video.src="https://www.youtube.com/embed/"+extractVideoID(input.value)
        input.value = '';
    }
});

socket.on('setup',time => setupCountdown(time))

socket.on('endedTime',time => {
    setupCountdown(time);
    beep.play();
})

socket.on('timer', (min,sec) => printCountdown(formatTime(min),formatTime(sec)));

