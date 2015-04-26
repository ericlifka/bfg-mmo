import _ from 'lodash';
import Chunk from './chunk';
import Player from './player';
import GameLoop from './game-loop';

const UpdateStrategies = {
    'player-move': function (playerName, {x, y}) {
        const player = this.players[playerName];
        if (!player) {
            console.log(`Player not on the server ${player}`);
        }

        // QUESTION:
        // Are incoming events processed realtime and then the
        // server loop broadcasts relevant changes or are the
        // incoming events batched up in the "updates" queue
        // and then processed all at once?
        player.move({x, y});
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
        this.emitter.sendToPlayer(playerName, 'player-data', player.serialize());

        const chunk = this.getPlayerChunk(playerName);
        this.playerEnteredChunk(player, chunk);

        this.emitter.sendToPlayer(playerName, 'ready', {});
    }

    playerLoggedOut(playerName) {
        const chunk = this.getPlayerChunk(playerName);
        const player = this.players[playerName];
        player.loggedIn = false;
        this.playerExitedChunk(player, chunk);
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

    playerEnteredChunk(player, chunk) {
        this.emitter.sendToPlayer(player.name, 'chunk-data', chunk.serialize());

        // Send other players to the joining client
        for (let playerName of chunk.players) {
            const other = this.players[playerName];
            console.log(`Sending login player init ${playerName} for ${player.name}`);
            this.emitter.sendToPlayer(player.name, 'player-enter', other.serialize());
        }

        this.emitter.joinRoom(player.name, chunk.id);
        this.emitter.sendToRoom(chunk.id, 'player-enter', player.serialize());
        console.log(`Player ${player.name} entered ${chunk.id}`);
    }

    playerExitedChunk(player, chunk) {
        chunk.players.delete(player.name);
        console.log(`Player ${player.name} exited ${chunk.id}`);
        this.emitter.sendToRoom(chunk.id, 'player-exit', player.name);
    }

    getPlayerChunk(playerName) {
        const chunkName = this.players[playerName].chunk;
        return this.chunks[chunkName];
    }

    initializePlayer(playerName) {
        let player = this.players[playerName];
        if (!player) {
            const position = {x: 100, y: 100};
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
            let chunkUpdates = {
                playerUpdates: {}
            };

            // const updates = chunk.updates;
            // chunk.updates = [];

            for (let playerName of chunk.players) {
                const player = this.players[playerName];
                const updates = player.updates;
                player.clearUpdates();
                chunkUpdates.playerUpdates[playerName] = updates;
            }

            this.emitter.sendToRoom(chunk.id, 'chunk-updates', chunkUpdates);
        });

        // QUESTION
        // Are we partitioning world updates and chunk updates.  Are normal
        // player actions going to be made through the chunk (room connection)?

        // _.each(this.players, (player, name) => {
        //     // const updates = player.updates;
        //     // player.clearUpdates();
        //     // serverUpdates.playerUpdates[name] = updates;
        //     //console.log(`${name} updates: ${updates}`);
        // });
    }
}
