var io = require('socket.io-client')
const assert = require("chai").assert;

testRoom = {
    "id": "room1",
    "started": false,
    "timeLeft":{
        "mode": 0,
        "min": 50,
        "sec": 0,
    },
    "countdown": ""
}

const { createRoom, countdown, joinRoom } = require("../src/utils/rooms")


describe('Suite of unit tests', function () {
    var socket;

    beforeEach(function (done) {
        socket = io.connect('http://localhost:3000', {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true
        });
        socket.on('connect', function () {
            done();
        });

    });
    afterEach(function (done) {
        if (socket.connected)socket.disconnect();
        done();
    });

    describe('CoWorking Focus tests', function () {
        it('Search existing room ',(done)=>{
            assert.equal( createRoom("general").id,"general");
            done();
        });
        it('Create and push new room ',(done)=>{
            assert.equal( createRoom("room1").id,"room1");
            assert.equal( createRoom("room2").id,"room2");
            done();
        });
        it("Join a room", (done)=>{
            socket.emit('joinRoom',"room1")
            socket.on('setup',(timeLeft)=>{
                assert.equal(timeLeft.id,testRoom.timeLeft.id);
                assert.equal(timeLeft.min,testRoom.timeLeft.min);
                assert.equal(timeLeft.sec,testRoom.timeLeft.sec);
                done();
            })
        });
    });

});