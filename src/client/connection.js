const socketConnectionString = () => '//' + document.domain + ':'  + '3000';

const TEST_USERS = [
    "walter",
    "eric",
    "dennis",
    "jesse"
];

class ConnectionManager {
    constructor() {
        this.queue = [];
        this.socket = null;
        this.connectionLive = false;
        this.interval = null;
        this.game = null;
    }

    connect(game) {
        this.game = game;
        this.game.accountName = TEST_USERS[_.random(TEST_USERS.length-1)];
        console.log(`Connecting as ${this.game.accountName}`);
        // I put this separate from the constructor because I'm assuming we'll
        // need authentication logic at some point in the near future and I
        // didn't want that tied to the module being created.
        if (!this.socket) {
            this.socket = io(socketConnectionString());

            this.socket.on('connect', () => {
                this.socket.on('authorized', (result) => {
                    this.connectionLive = true;
                });

                this.socket.emit('authorize', {
                    username: this.game.accountName,
                    password: '1234'
                });
            });

            this.socket.on('chunk-data', _.bind(game.loadChunk, game));
            this.socket.on('player-data', _.bind(game.initializePlayer, game));
            this.socket.on('player-enter', _.bind(game.playerEnter, game));
            this.socket.on('player-exit', _.bind(game.playerExit, game));
            this.socket.on('chunk-updates', _.bind(game.chunkUpdates, game));

            this.socket.on('ready', () => {
                game.worldReady = true;
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

export default new ConnectionManager();
