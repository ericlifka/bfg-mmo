export default class Game {
    constructor() {
        this.chunks = {
            town: {
                dimensions: {x: 1024, y: 576},
                players: []
            }
        };

        this.players = {};
    }

    setEmitter(emitter) {
        this.emitter = emitter;
    }

    playerLoggedIn(player) {
        this.initializePlayer(player);
        //TODO:
        //  - put player in world
        //  - send player world state
        //  - send player state / info to other players on next tick
    }

    playerLoggedOut(player) {
        //TODO: remove them from world
    }

    processUpdates(player, updates) {
        console.log("client updates: ", player, updates);
    }

    // internal

    initializePlayer(player) {
        if (!this.players[player]) {
            this.players[player] = {
                chunk: 'town',
                position: {x: 100, y: 100}
            };
        }

        const chunkName = this.players[player].chunk;
        const chunk = this.chunks[chunkName];

        chunk.players.push(player);
    }
}
