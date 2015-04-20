import { Server } from 'http';
import express from 'express';
import io from 'socket.io';

import ConnectionPool from './connection-pool';
import Game from './game';

const connPool = new ConnectionPool();
const game = new Game();
connPool.setEventDelegate(game);
game.setEmitter(connPool);

const app = express();
const httpServer = Server(app);
const socketServer = io(httpServer);

socketServer.on('connection', (socket) => {
    connPool.newConnection(socket);
});

export var start = function () {
    httpServer.listen(3000, function () {
        console.log("listening on http://localhost:3000");
    });
};
