const express = require('express');
const socketio = require('socket.io');
const app = express();

const namespaces = require('./data/namespaces');
const Room = require('./classes/Room');

app.use(express.static(__dirname + '/public'));

const server = app.listen(9001);
const io = socketio(server);

app.get('/change-ns', (req, res) => {
    namespaces[0].addRoom(new Room(namespaces[0].rooms.length, 'Deleted Articles', 0));
    io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
    res.json(namespaces[0]);
});

io.on('connection', socket => {
    console.log(socket.id, 'has connected!');
    socket.emit('welcome', 'Welcome to the server!');
    socket.on('clientConnect', data => {
        console.log(socket.id, 'has connected!');
        socket.emit('nsList', namespaces);
    });
});

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', socket => {
        console.log(`${socket.id} has connected to ${namespace.endpoint}`);

        socket.on('joinRoom', async (roomId, callback) => {
            roomId = parseInt(roomId);
            const room = namespace.rooms.find(nsRoom => nsRoom.id === roomId);
            const roomName = room.id + '-' + room.title;

            socket.rooms.forEach(joinedRoom => {
                if(joinedRoom !== socket.id && joinedRoom !== roomName) {
                    socket.leave(joinedRoom);
                }
            });

            socket.join(roomName);

            const sockets = await io.of(namespace.endpoint).in(roomName).fetchSockets();
            const socketCount = sockets.length;

            callback({
                roomTitle: room.title,
                numUsers: socketCount
            });
        });

        socket.on('newMessageToRoom', messageObj => {
            const roomName = Array.from(socket.rooms).pop();
            console.log(roomName);

            messageObj.date = Date.now();

            io.of(namespace.endpoint).in(roomName).emit('messageToRoom', messageObj);
        });
    });
});