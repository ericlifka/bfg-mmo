const LOL_USERS_TABLE = {
    "walter": "1234",
    "eric": "1234",
    "dennis": "1234",
    "jesse": "1234"
};
const authenticate = (username, password) => {
    return LOL_USERS_TABLE.hasOwnProperty(username) &&
        LOL_USERS_TABLE[username] === password;
};

class ConnectionPool {
    constructor() {
        this.connections = {};
    }

    newConnection(socket) {
        socket.on('authorize', ({username, password} = {}) => {
            if (!authenticate(username, password)) {
                socket.emit('authorized', {
                    authorized: false
                });
                return;
            }

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
            console.log("client updates: " + JSON.stringify(updates));
        });

        socket.on('disconnect', () => {
            this.connections[socket.id] = null;
        });

    }
}

export default new ConnectionPool();