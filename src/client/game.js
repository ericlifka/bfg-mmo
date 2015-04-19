import Input from './input';
import Player from './player';
import Connection from './connection';

class Game {

    constructor(viewport) {
        Connection.connect();

        this.namespace = 'game';
        this.player = null;
        this.viewport = viewport;
        this.assetPaths = [
            'sprites/wizard_girl.png'
        ];
        this.renderer = new PIXI.WebGLRenderer(1024, 576);
        let interactive = true;
        this.stage = new PIXI.Stage(0xdfdfdf, interactive);
        this.viewport.appendChild(this.renderer.view);

        this.input = new Input(this.stage);
    }

    start() {
        // Load assets and initialize

        // Loading operations that may block should be here.
        // Initializing new game entities should _not_ block and should
        // use assets that have already been loaded.  At least until on
        // demand loading is figured out.

        // Current world/plane etc would come from the server and the
        // related assets would need to be loaded at this point.

        let loader = new PIXI.AssetLoader(this.assetPaths);
        loader.onComplete = () => {
            this.initialize();
            this.startGameLoop();
        };
        loader.load();
    }

    initialize() {
        // Player data would come from the server in some manner
        let test_player_data = {
            image: 'sprites/wizard_girl.png'
        };

        this.player = new Player(this, test_player_data);
        this.stage.addChild(this.player.sprite);
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

        let inputState = this.input.getFrameState();

        this.player.update(elapsed, inputState);

        // Need a camera for world to screen translations
        this.player.sprite.x = Math.round(this.player.position.x);
        this.player.sprite.y = Math.round(this.player.position.y);

        this.renderer.render(this.stage);
        this.input.click = null;
    }

    elapsedSinceLastFrame() {
        let now = Date.now();
        let elapsed = now - this.lastTimeStamp;
        this.lastTimeStamp = now;
        return elapsed;
    }
}

export default Game;
