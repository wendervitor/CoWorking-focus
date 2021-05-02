const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const assert = require("chai").assert;

const registerRoomHandlers = require("../src/eventHandlers/roomHandler");

const { getRoomBySocketID, getRoom, handlePomodoroChange, handlePomodoroTimer} = require("../src/utils/room")

describe("CoWorking Focus Testing", () => {
    let io, serverSocket, clientSocket;
  
    before((done) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = new Client(`http://localhost:${port}`);
        io.on("connection", (socket) => {
          serverSocket = socket;
          registerRoomHandlers(io,socket);
        });
        clientSocket.on("connect", done);
      });
    });
  
    after(() => {
      io.close();
      clientSocket.close();
    });

    describe("Room tests", ()=>{
        it('Create and push new room ',(done)=>{
            assert.equal( getRoom("room1").id,"room1");
            assert.equal( getRoom("room2").id,"room2");
            done();
        });
        it("Join a room", (done)=>{
            clientSocket.emit('room:joinRoom',"room1");
            clientSocket.on('setup',(timeLeft) =>{
                assert.equal(timeLeft.state,'work');
                assert.equal(timeLeft.min,25);
                assert.equal(timeLeft.sec,0);
                done();
            })
        });
        it('Get existing room ',(done)=>{
            assert.equal( getRoom("room1").id,"room1");
            done();
        });
        it('Get Room By SocketID ',(done)=>{
            assert.equal( getRoomBySocketID(clientSocket.id).id,"room1");
            done();
        }); 
    });
    describe("Pomodoro changes", ()=>{
        let room;
        beforeEach((done) => {
            room = getRoomBySocketID(clientSocket.id);
            room.autostart = true;
            handlePomodoroChange(room);
            done();
        });
        for(let i=0;i<3;i++){
            it(`work -> short break ${i+1}`,(done)=>{
                assert.equal(room.timeLeft.state,'shortBreak');
                done();
            });
            it(`short break -> work ${i+1}`,(done)=>{
                assert.equal(room.timeLeft.state,'work')
                done();
            })
        }
        it('work->long break',(done)=>{
            assert.equal(room.timeLeft.state,'longBreak')
            done();
        });
        it('long break->work',(done)=>{
            assert.equal(room.timeLeft.state,'work')
            done();
        });
    });
    describe("Timer tests",()=>{
        let room;
        before((done)=>{
            room = getRoomBySocketID(clientSocket.id);
            done();
        })
        it('Sec == 0 && Min != 0 (timer continue)',(done)=>{
            assert.equal(handlePomodoroTimer(room),'timer');
            done()
        })
        it('Sec != 0 && Min == 0 (timer continue)',(done)=>{
            assert.equal(handlePomodoroTimer(room),'timer');
            done();
        });
        it('Sec == 0 && Min == 0 (timer end)',(done)=>{
            room.timeLeft.min=0;
            room.timeLeft.sec=0;
            assert.equal(handlePomodoroTimer(room),'endedTime');
            done();
        });
    });

  });