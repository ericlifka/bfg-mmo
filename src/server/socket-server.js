import http from 'http';
import express from 'express';
import io from 'socket.io';

const app = express();
const httpServer = http.Server(app);
const socketServer = io(httpServer);

socketServer.on('connection', function (socket) {
    console.log("a socket connected");
});

export var start = function () {
    httpServer.listen(3000, function () {
        console.log("listening on http://localhost:3000");
    });
};
