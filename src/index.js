const app = require('express')();
const server = require('http').Server(app);
const { setUpTimer, countdown } = require('./timer');

setUpTimer(server);
const myTimer = setInterval(countdown,1000);

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/timer.html');
});



server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});