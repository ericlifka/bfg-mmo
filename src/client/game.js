import Input from './input';
import Level from './level';
import Scene from './scene';
import Player from './player';
import Connection from './connection';
import RemotePlayer from './remote-player';

class Game {

    constructor(viewport) {
        Connection.connect(this);

        this.player = null;
        this.viewport = viewport;
        this.assetPaths = [
            'sprites/wizard_girl.png',
            'sprites/32x32_map_tile v3.1.json'
        ];

        this.renderer = new PIXI.WebGLRenderer(1024, 576);
        this.stage = new PIXI.Container(0xdfdfdf, true); // PIXI.Stage(0xdfdfdf, true);
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

        //let loader = new PIXI.AssetLoader(this.assetPaths);
        //loader.onComplete = () => {
        //    this.initialize();
        //    this.startGameLoop();
        //};
        //loader.load();

        for (let path of this.assetPaths) {
            PIXI.loader.add(path);
        }

        PIXI.loader.load(() => {
            //this.initialize();
            this.startGameLoop();
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

    startGameLoop() {
        let browserFrameHook = () => {
            this.nextAnimationFrame();
            requestAnimationFrame(browserFrameHook);
        };

        this.lastTimeStamp = Date.now();
        requestAnimationFrame(browserFrameHook);
    }

    nextAnimationFrame() {
        let elapsed = this.elapsedSinceLastFrame();
        // FIXME: Temp hack to filter out an invalid state
        // really this would be a client state that is set
        // when the appropriate server data has been loaded
        // by the client and the client is ready to process
        // local events.
        if (this.worldReady) {
            // Server data loaded
            let inputState = this.input.getFrameState();
            for (let entity of this.entities) {
                entity.update(elapsed, inputState);
            }
            this.scene.update();
            this.renderer.render(this.stage);
            this.input.click = null;
        } else {
            // Waiting for server data
        }
    }

    elapsedSinceLastFrame() {
        let now = Date.now();
        let elapsed = now - this.lastTimeStamp;
        this.lastTimeStamp = now;
        return elapsed;
    }
}

export default Game;
