import _ from 'lodash';
import Chunk from './chunk';
import Player from './player';
import GameLoop from './game-loop';

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
        this.initializePlayer(playerName);
        //TODO:
        //  - put player in world
        //  - send player world state
        //  - send player state / info to other players on next tick
        const player = this.players[playerName];
        const chunk = this.getPlayerChunk(playerName);
        const socket = this.emitter.connections[playerName];
        socket.emit('chunk-data', chunk.serialize());
        socket.emit('player-data', player.serialize());
        socket.emit('ready', {});
    }

    playerLoggedOut(playerName) {
        const chunk = this.getPlayerChunk(playerName);

        this.players[playerName].loggedIn = false;
        chunk.players.delete(playerName);
    }

    processUpdates(player, updates) {
        console.log("client updates: ", player, updates);
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
        let player = null;
        if (!this.players[playerName]) {
            let position = {x: 100, y: 100};
            const chunkName = 'spawn';
            player = new Player(playerName, chunkName, position);
            this.players[playerName] = player;
        } else {
            player = this.players[playerName];
        }

        player.loggedIn = true;

        const chunk = this.loadChunk(player.chunk);

        chunk.players.add(playerName);
    }

    updateTick(dTime) {
        console.log(`TICK! ${dTime}`);

        _.each(this.chunks, (chunk, name) => {
            const updates = chunk.updates;
            chunk.updates = [];

            console.log(`${name} updates: ${updates}`);
        });

        _.each(this.players, (player, name) => {
            const updates = player.updates;
            player.updates = [];

            console.log(`${name} updates: ${updates}`);
        });
    }
}
