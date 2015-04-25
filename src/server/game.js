import _ from 'lodash';
import GameLoop from './game-loop';
import Chunk from './chunk';

const UpdateStrategies = {
    'player-move': function (player, {x, y}) {
        console.log(`move: x-${x}, y-${y}`);
    }
};

export default class Game {
    constructor() {
        this.chunks = {};
        this.players = {};
    }

    setEmitter(emitter) {
        this.emitter = emitter;
    }

    startUpdateLoop() {
        GameLoop.run(100, dTime => this.updateTick(dTime));
    }

    playerLoggedIn(player) {
        this.initializePlayer(player);
        //TODO:
        //  - put player in world
        //  - send player world state
        //  - send player state / info to other players on next tick
        const chunk = this.getPlayerChunk(player);
        const socket = this.emitter.connections[player];
        socket.emit('chunk-data', chunk.serialize());
    }

    playerLoggedOut(playerName) {
        const chunk = this.getPlayerChunk(playerName);

        this.players[playerName].loggedIn = false;
        chunk.players.delete(playerName);
    }

    processUpdates(player, updates) {
        _.each(updates, (update) => {
            const strategy = UpdateStrategies[update.type];
            if (strategy) {
                strategy.call(this, player, update.description);
            } else {
                console.error(`Encountered update type without valid strategy: ${update.type}`);
            }
        });
    }

    loadChunk(id) {
        if (!this.chunks[id]) {
            this.chunks[id] = new Chunk(id);
        }
        return this.chunks[id];
    }

    getPlayerChunk(playerName) {
        const chunkName = this.players[playerName].chunk;
        return this.chunks[chunkName];
    }

    // internal

    initializePlayer(playerName) {
        if (!this.players[playerName]) {
            this.players[playerName] = {
                chunk: 'spawn',
                position: {x: 100, y: 100},
                updates: []
            };
        }

        this.players[playerName].loggedIn = true;

        const chunkName = this.players[playerName].chunk;
        const chunk = this.loadChunk(chunkName);

        chunk.players.add(playerName);
    }

    updateTick(dTime) {
        _.each(this.chunks, (chunk, name) => {
            const updates = chunk.updates;
            chunk.updates = [];

            //console.log(`${name} updates: ${updates}`);
        });

        _.each(this.players, (player, name) => {
            const updates = player.updates;
            player.updates = [];

            //console.log(`${name} updates: ${updates}`);
        });
    }
}
