const socketConnectionString = () => '//' + document.domain + ':'  + '3000';

class ConnectionManager {
    constructor() {
        this.socket = null;
    }

    connect() {
        // I put this separate from the constructor because I'm assuming we'll need authentication logic
        // at some point in the near future and I didn't want that tied to the module being created.
        if (!this.socket) {
            this.socket = io(socketConnectionString());
        }
    }

    sendEvent(payload) {
        this.socket.emit('client-event', payload);
    }
}

export default new ConnectionManager();
