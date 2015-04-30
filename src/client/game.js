import Connection from './connection';
import Input from './input';
import Level from './level';
import Player from './player';
import RemotePlayer from './remote-player';
import RenderLoop from './render-loop';
import Scene from './scene';

class Game {

    constructor(viewport) {
        const conn = this.connection = new Connection(this);
        conn.subscribe('chunk-data', _.bind(this.loadChunk, this));
        conn.subscribe('player-data', _.bind(this.initializePlayer, this));
        conn.subscribe('player-enter', _.bind(this.playerEnter, this));
        conn.subscribe('player-exit', _.bind(this.playerExit, this));
        conn.subscribe('chunk-updates', _.bind(this.chunkUpdates, this));
        conn.subscribe('ready', () => this.worldReady = true);

        this.renderLoop = new RenderLoop();
        this.renderLoop.addFrameHandler(dTime => this.nextAnimationFrame(dTime));
        this.renderLoop.addFrameHandler(dTime => this.connection.processQueue(), 50);

        this.viewport = viewport;
        this.assetPaths = [
            'sprites/wizard_girl.png',
            'sprites/32x32_map_tile v3.1.json'
        ];

        this.renderer = new PIXI.WebGLRenderer(1024, 576);
        this.stage = new PIXI.Container(0xdfdfdf, true);
        this.scene = new Scene(this, 1024, 576);
        this.input = new Input(this.stage);

        this.viewport.appendChild(this.renderer.view);

        this.entities = [];
        this.player = null;
        this.players = {};
        this.currentLevel = null;

        this.worldReady = false;
    }

    start() {
        // Load assets and initialize

        // Loading operations that may block should be here.
        // Initializing new game entities should _not_ block and should
        // use assets that have already been loaded.  At least until on
        // demand loading is figured out.

        // Current world/plane etc would come from the server and the
        // related assets would need to be loaded at this point.

        for (let path of this.assetPaths) {
            PIXI.loader.add(path);
        }

        PIXI.loader.load(() => {
            this.connection.connect(() => {
                this.renderLoop.start();
            });
        });
    }

    loadChunk(chunkData) {
        this.currentLevel = new Level(chunkData);
        this.addLevel(this.currentLevel);
    }

    initializePlayer(playerData) {
        this.player = new Player(this, playerData);
        this.addEntity(this.player);
        this.scene.setTrackingEntity(this.player);
    }

    playerEnter(playerData) {
        // maybe need to figure out better event filtering
        if (playerData.name !== this.accountName) {
            console.log(`Loading data for ${playerData.name}`);
            let player = new RemotePlayer(this, playerData);
            this.players[player.name] = player;
            this.addEntity(player);
        }
    }

    playerExit(playerName) {
        if (playerName !== this.accountName) {
            console.log(`Received exiting event for ${playerName}`);
            let player = this.players[playerName];
            if (player) {
                this.removeEntity(player);
                delete this.player[playerName];
            }
        }
    }

    chunkUpdates(updates) {
        // console.log(updates);
        _.each(updates.playerUpdates, (playerUpdateData, name) => {
            let player = this.players[name];
            if (!player) {
                return;
            }
            if (playerUpdateData.position) {
                player.position = playerUpdateData.position;
            }
        });
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.scene.addEntity(entity);
    }

    removeEntity(entity) {
        this.scene.removeEntity(entity);
        _.remove(this.entities, entity);
    }

    addLevel(level) {
        for (let tile of level.tiles) {
            this.scene.addTile(tile);
        }
    }

    nextAnimationFrame(dTime) {
        // FIXME: Temp hack to filter out an invalid state
        // really this would be a client state that is set
        // when the appropriate server data has been loaded
        // by the client and the client is ready to process
        // local events.
        if (this.worldReady) {
            // Server data loaded
            let inputState = this.input.getFrameState();
            for (let entity of this.entities) {
                entity.update(dTime, inputState);
            }
            this.scene.update();
            this.renderer.render(this.stage);
            this.input.click = null;
        } else {
            // Waiting for server data
        }
    }
}

export default Game;
