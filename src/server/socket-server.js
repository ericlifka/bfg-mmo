import { Server } from 'http';
import express from 'express';
import io from 'socket.io';

import ConnectionPool from './connection-pool';

const app = express();
const httpServer = Server(app);
const socketServer = io(httpServer);

socketServer.on('connection', function (socket) {
    ConnectionPool.newConnection(socket);
    //console.log("a socket connected");
    //socket.on('client-updates', function(data) {
    //    var updates = data.updates;
    //    console.log("client updates: " + JSON.stringify(updates));
    //});
});

export var start = function () {
    httpServer.listen(3000, function () {
        console.log("listening on http://localhost:3000");
    });
};
