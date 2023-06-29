const express = require('express');
const socketio = require('socket.io');
const app = express();

app.use(express.static(__dirname + '/public'));

const server = app.listen(8000);
const io = socketio(server);

io.on('connection', socket => {
    console.log(socket.id);
    socket.emit('messageFromServer', { data: 'Welcome to the socket server!' });
});