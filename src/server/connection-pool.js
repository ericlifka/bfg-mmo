import Auth from './auth';

export default class ConnectionPool {
    constructor() {
        this.connections = {};
    }

    setEventDelegate(delegate) {
        this.delegate = delegate;
    }

    newConnection(socket) {
        socket.on('authorize', ({username, password} = {}) => {
            if (Auth.authenticate(username, password)) {
                socket.player = username;
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

    addEventListeners(socket) {

        socket.on('client-updates', (data) => {
            const updates = data.updates;
            this.delegate.processUpdates(socket.player, updates);
        });

        socket.on('disconnect', () => {
            this.connections[socket.player] = null;
            this.delegate.playerLoggedOut(player);
        });

    }
}
