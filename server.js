var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let PORT = process.env.PORT || 3000; 
app.use('/', express.static('public'));

var clients = 0;
io.on('connection', function (socket) {
    clients++;
    io.sockets.emit('broadcast', clients);
    socket.on('disconnect', function () {
        clients--;
        io.sockets.emit('broadcast', clients);
    });
    socket.on('pos',function (data) {
        io.sockets.emit('pos', data);
    })
    socket.on('secPos', function (data) {
        io.sockets.emit('secPos', data);
    })
    socket.on('win', function (data) {
        io.sockets.emit('win', data);
    })
});

http.listen(PORT, function () {
    console.log('listening on localhost:3000');
});