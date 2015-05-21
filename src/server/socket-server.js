import { Server } from 'http';
import express from 'express';
import io from 'socket.io';

import ConnectionPool from './connection-pool';
import Game from './game';

const app = express();
const httpServer = Server(app);
const socketServer = io(httpServer);

const connPool = new ConnectionPool(socketServer);
const game = new Game();
connPool.setEventDelegate(game);
game.setEmitter(connPool);

export var start = PORT => httpServer.listen(PORT, () => {
    game.startUpdateLoop();
    console.log(`listening on http://localhost:${PORT}`);
});
