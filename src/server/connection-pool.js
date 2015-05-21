import Auth from './auth';

export default class ConnectionPool {
    constructor(server) {
        this.connections = {};
        this.server = server;
        this.addServerListeners();
    }

    setEventDelegate(delegate) {
        this.delegate = delegate;
    }

    newConnection(socket) {
        socket.on('authorize', ({username, password} = {}) => {
            if (Auth.authenticate(username, password)) {
                socket.player = username;

                if (this.connections[socket.player]) {
                    // authenticated user logged in, kick the current connection
                    console.log(`Kicking old session for player ${socket.player}`);
                    let currentConnection = this.connections[socket.player];
                    currentConnection.disconnect();
                    this.connections[socket.player] = null;
                    this.delegate.playerLoggedOut(socket.player);
                }

                this.connections[socket.player] = socket;
                this.addEventListeners(socket);

                socket.emit('authorized', {
                    authorized: true
                });

                this.delegate.playerLoggedIn(socket.player);
            }
            else {
                socket.emit('authorized', {
                    authorized: false
                });
            }
        });
    }

    joinRoom(player, room) {
        const socket = this.connections[player];
        if (!socket) {
            console.error(`No valid socket found for player ${player}`);
            return;
        }

        socket.join(room);
    }

    sendToPlayer(player, event, data) {
        const socket = this.connections[player];
        if (!socket) {
            console.error(`No valid socket found for player ${player}`);
            return;
        }

        socket.emit(event, data);
    }

    sendToRoom(room, event, data) {
        this.server.to(room).emit(event, data);
    }

    addServerListeners() {
        this.server.on('connection', socket => this.newConnection(socket));
    }

    addEventListeners(socket) {

        socket.on('client-updates', (data) => {
            const updates = data.updates;
            this.delegate.processUpdates(socket.player, updates);
        });

        socket.on('chat-message', ({message}) => {
            const from = socket.player;
            this.server.emit('chat-message', {message, from});
        });

        socket.on('disconnect', () => {
            const player = socket.player;
            this.connections[player] = null;
            this.delegate.playerLoggedOut(player);
        });

    }
}
