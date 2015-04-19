import { Server } from 'http';
import express from 'express';
import io from 'socket.io';

import ConnectionPool from './connection-pool';

const app = express();
const httpServer = Server(app);
const socketServer = io(httpServer);

socketServer.on('connection', (socket) => ConnectionPool.newConnection(socket));

export var start = function () {
    httpServer.listen(3000, function () {
        console.log("listening on http://localhost:3000");
    });
};
