const express = require('express');
const socketio = require('socket.io');
const app = express();

const namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const server = app.listen(9000);
const io = socketio(server);

io.on('connection', socket => {
    console.log(socket.id, 'has connected!');
    socket.emit('welcome', 'Welcome to the server!');
    socket.on('clientConnect', data => {
        console.log(socket.id, 'has connected!');
    });
    socket.emit('nsList', namespaces);
});

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', socket => {
        
    });
});