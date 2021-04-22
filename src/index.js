const path = require('path')
const express = require('express');

const app = express();
const server = require('http').Server(app);

const { setUpTimer } = require('./socketSetup');

app.use(express.static(path.join(__dirname,'public')));

setUpTimer(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});