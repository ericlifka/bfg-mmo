const socketConnectionString = () => '//' + document.domain + ':'  + '3000';

class ConnectionManager {
    constructor() {
        this.queue = [];
        this.socket = null;
        this.interval = null;
    }

    connect() {
        // I put this separate from the constructor because I'm assuming we'll need authentication logic
        // at some point in the near future and I didn't want that tied to the module being created.
        if (!this.socket) {
            this.socket = io(socketConnectionString());
        }

        if (!this.interval) {
            this.interval = window.setInterval(() => this.processQueue(), 100);
        }
    }

    sendEvent(event, payload) {
        this.queue.push({
            [event]: payload
        });
        //this.socket.emit('client-event', payload);
    }

    processQueue() {
        const toSend = this.queue;
        this.queue = [];

        this.socket.emit('client-updates', {
            updates: toSend
        });
    }
}

export default new ConnectionManager();
