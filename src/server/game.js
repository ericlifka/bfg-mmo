import _ from 'lodash';
import Chunk from './chunk';
import Player from './player';
import GameLoop from './game-loop';

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

    playerLoggedIn(playerName) {
        //TODO:
        //  - send player state / info to other players on next tick
        const player = this.initializePlayer(playerName);
        const chunk = this.getPlayerChunk(playerName);

        this.emitter.sendToPlayer(playerName, 'chunk-data', chunk.serialize());
        this.emitter.sendToPlayer(playerName, 'player-data', player.serialize());
        this.emitter.sendToPlayer(playerName, 'ready', {});
    }

    playerLoggedOut(playerName) {
        const chunk = this.getPlayerChunk(playerName);

        this.players[playerName].loggedIn = false;
        chunk.players.delete(playerName);
    }

    processUpdates(player, updates) {
        _.each(updates, (update) => {
            const strategy = UpdateStrategies[update.type];
            if (!strategy) {
                console.error(`Encountered update type without valid strategy: ${update.type}`);
                return;
            }

            strategy.call(this, player, update.description);
        });
    }

    // internal

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

    initializePlayer(playerName) {
        let player = this.players[playerName];
        if (!player) {
            let position = {x: 100, y: 100};
            const chunkName = 'spawn';
            player = new Player(playerName, chunkName, position);
            this.players[playerName] = player;
        }

        player.loggedIn = true;
        const chunk = this.loadChunk(player.chunk);
        chunk.players.add(playerName);

        return player;
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
