import _ from 'lodash';
import GameLoop from './game-loop';

export default class Game {
    constructor() {
        this.chunks = {
            town: {
                dimensions: {x: 1024, y: 576},
                players: new Set(),
                updates: []
            }
        };

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
    }

    playerLoggedOut(playerName) {
        const chunkName = this.players[playerName].chunk;
        const chunk = this.chunks[chunkName];

        this.players[playerName].loggedIn = false;
        chunk.players.delete(playerName);
    }

    processUpdates(player, updates) {
        console.log("client updates: ", player, updates);
    }

    // internal

    initializePlayer(playerName) {
        if (!this.players[playerName]) {
            this.players[playerName] = {
                chunk: 'town',
                position: {x: 100, y: 100},
                updates: []
            };
        }

        this.players[playerName].loggedIn = true;

        const chunkName = this.players[playerName].chunk;
        const chunk = this.chunks[chunkName];

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
