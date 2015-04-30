import Auth from './auth';

const PORT = 3000; // config this value eventually
const socketConnectionString = () => `//${document.domain}:${PORT}`;

export default class Connection {
    // TODO: I don't feel that a connection should have to know about a game, maybe subscribing externally would be cleaner
    constructor(game) {
        this.queue = [];
        this.handlers = [];
        this.socket = null;
        this.connectionLive = false;
        this.game = game;
    }

    connect(authCallback) {
        const game = this.game;

        if (!this.socket) {
            this.socket = io(socketConnectionString());

            this.subscribeToSocketEvents();
        }

        this.socket.on('connect', () => {
            Auth.authenticate(this.socket, (username) => {
                this.connectionLive = true;
                game.accountName = username;
                authCallback();
            });
        });

        this.socket.on('disconnect', () => {
            this.connectionLive = false;
        });

        this.socket.on('ready', () => {
            game.worldReady = true;
        });
    }

    getFlushHook() {
        return () => {
            this.processQueue();
        };
    }

    subscribe(event, handler) {
        this.handlers.push({event, handler});

        if (this.socket) {
            this.socket.on(event, handler);
        }
    }

    sendEvent(event, payload) {
        this.queue.push({
            type: event,
            description: payload
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

    subscribeToSocketEvents() {
        this.handlers.forEach(({event, handler}) => {
            this.socket.on(event, handler);
        });
    }
}
