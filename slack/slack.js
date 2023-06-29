const express = require('express');
const socketio = require('socket.io');
const app = express();

const namespaces = require('./data/namespaces');
const Room = require('./classes/Room');

app.use(express.static(__dirname + '/public'));


const server = app.listen(9000);
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
    });
});