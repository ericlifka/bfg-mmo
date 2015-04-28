import Auth from './auth';

const socketConnectionString = () => '//' + document.domain + ':'  + '3000';

export default class Connection {
    // TODO: I don't feel that a connection should have to know about a game, maybe subscribing externally would be cleaner
    constructor(game) {
        this.queue = [];
        this.socket = null;
        this.connectionLive = false;
        this.game = game;
    }

    connect(authCallback) {
        const game = this.game;

        if (!this.socket) {
            this.socket = io(socketConnectionString());
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

        this.socket.on('chunk-data', _.bind(game.loadChunk, game));
        this.socket.on('player-data', _.bind(game.initializePlayer, game));
        this.socket.on('player-enter', _.bind(game.playerEnter, game));
        this.socket.on('player-exit', _.bind(game.playerExit, game));
        this.socket.on('chunk-updates', _.bind(game.chunkUpdates, game));

        this.socket.on('ready', () => {
            game.worldReady = true;
        });
    }

    getFlushHook() {
        return () => {
            this.processQueue();
        };
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
}
