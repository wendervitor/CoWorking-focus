const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const assert = require("chai").assert;
const { createRoom, countdown } = require("../src/utils/rooms")

describe("my awesome project", () => {
    let io, serverSocket, clientSocket;

    before((done) => {
        const httpServer = createServer();
        
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    after(() => {
        io.close();
        clientSocket.close();
    });

    it("should work", (done) => {
        clientSocket.on("hello", (arg) => {
            assert.equal(arg, "world");
            done();
        });
        serverSocket.emit("hello", "world");
    });

    it("should work (with ack)", (done) => {
        serverSocket.on("hi", (cb) => {
            cb("hola");
        });
        clientSocket.emit("hi", (arg) => {
            assert.equal(arg, "hola");
            done();
        });
    });

    it("creating existing room", (done) =>{
        assert.equal( createRoom("general").id,"general");
        done();
    });

    it("creating new room", (done)=>{
        assert.equal( createRoom("test1").id,"test1");
        assert.equal( createRoom("test2").id,"test2");
        done();
    });

    // it("countdown 1", (done)=>{
    //     const room = {
    //         "id": "test1",
    //         "started": 0,
    //         "timeLeft":{
    //             "mode": 0,
    //             "min": 0,
    //             "sec": 10,
    //         },
    //         "countdown": ""
    //     }
    //     serverSocket.join(room);
    //     countdown(serverSocket,room);
    //     clientSocket.on("timer",(min,sec)=>{
            
    //         assert.equal(room.min,min);
    //         assert.equal((room.sec-1),sec);
    //         done();
    //     })
    // })

});