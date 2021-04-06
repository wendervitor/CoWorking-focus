const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/timer.html');
});

//const connections = [];
let started = false;
var min = 0;
var sec = 30;
var minLeft = min;
var secLeft = sec;
var myTimer;


io.on('connection', (socket) => {
    
    //connections.push({"id":socket.id,"nickname":"vtn"})
    console.log('a user connected !');
    io.emit('setup',minLeft,secLeft);

    if(!started){
        console.log('started');
        myTimer = setInterval(countdown,1000);
        started = true;
        function countdown(){
            if(secLeft != 0){
                secLeft = secLeft-1;       
                io.emit('timer',minLeft,secLeft);
            }
            else if(secLeft == 0 && minLeft != 0){
                minLeft = minLeft - 1;
                secLeft = 59;

                io.emit('timer',minLeft,secLeft);
                
            }
            else if(secLeft == 0 && minLeft == 0){
                started = false;
                //min = 0;
                //sec = 30;
                io.emit('pause',min,sec);
                clearInterval(myTimer);
            }        
        }
    }

    

    /*socket.on('timer', (min,sec) =>{  
        console.log(min, sec);
        io.emit('timer', min, sec); 
    });
    socket.on('pause', (min,sec) =>{
        console.log("paused");
        io.emit('pause',min,sec);
    });
    */
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});