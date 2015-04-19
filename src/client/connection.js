const socketConnectionString = () => '//' + document.domain + ':'  + '3000';

class ConnectionManager {
    constructor() {
        this.queue = [];
        this.socket = null;
        this.connectionLive = false;
        this.interval = null;
    }

    connect() {
        // I put this separate from the constructor because I'm assuming we'll need authentication logic
        // at some point in the near future and I didn't want that tied to the module being created.
        if (!this.socket) {
            this.socket = io(socketConnectionString());

            this.socket.on('connect', () => {
                this.socket.on('authorized', (result) => {
                    this.connectionLive = true;
                });

                this.socket.emit('authorize', {
                    username: 'eric',
                    password: '1234'
                });
            });

            this.socket.on('disconnect', () => {
                this.connectionLive = false;
            });
        }

        if (!this.interval) {
            this.interval = window.setInterval(() => this.processQueue(), 100);
        }
    }

    sendEvent(event, payload) {
        this.queue.push({
            [event]: payload
        });
    }

    processQueue() {
        if (this.connectionLive && this.queue.length > 0) {
            const toSend = this.queue;
            this.queue = [];

            this.socket.emit('client-updates', {
                updates: toSend
            });
        }
    }
}

export default new ConnectionManager();
