const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/timer.html');
});

const connections = [];
let started = false;

io.on('connection', (socket) => {
    
    connections.push({"id":socket.id,"nickname":"vtn"})
    //console.log('a user connected:', connections);
    
    if(!started){
        
    }

    socket.on('timer', (min,sec) =>{  
        console.log(min, sec);
        io.emit('timer', min, sec); 
    });
    socket.on('pause', (min,sec) =>{
        console.log("paused");
        io.emit('pause',min,sec);
    });
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});