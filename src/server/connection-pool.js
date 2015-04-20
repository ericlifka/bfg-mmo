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
            if (!Auth.authenticate(username, password)) {
                socket.emit('authorized', {
                    authorized: false
                });
                return;
            }

            socket.authorizedUser = username;
            this.connections[socket.id] = socket;
            this.addEventListeners(socket);

            socket.emit('authorized', {
                authorized: true
            });
        });
    }

    addEventListeners(socket) {

        socket.on('client-updates', (data) => {
            const updates = data.updates;
            this.delegate.processUpdates(socket.authorizedUser, updates);
        });

        socket.on('disconnect', () => {
            this.connections[socket.id] = null;
        });

    }
}
