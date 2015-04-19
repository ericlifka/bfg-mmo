class ConnectionPool {
    constructor() {
        this.connections = {};
    }

    newConnection(socket) {
        socket.on('authorize', (data) => {
            console.log("auth attempt: " + JSON.stringify(data));

            this.connections[socket.id] = socket;
            console.log(this.connections);

            socket.emit('authorized', {
                authorized: true
            });
        });
    }
}

export default new ConnectionPool();