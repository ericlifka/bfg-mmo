import Input from './input'

class Game {
    constructor(viewport) {
        this.viewport = viewport;
        this.assetPaths = [];
        this.renderer = new PIXI.WebGLRenderer(1024, 576);
        this.stage = new PIXI.Stage(0xdfdfdf);
        this.viewport.appendChild(this.renderer.view);

        this.input = new Input();
    }

    start() {
        let browserFrameHook = () => {
            this.nextAnimationFrame();
            requestAnimationFrame(browserFrameHook);
        }

        this.lastTimeStamp = Date.now();
        requestAnimationFrame(browserFrameHook);
    }

    nextAnimationFrame() {
        let elapsed = this.elapsedSinceLastFrame();
        let inputState = this.input.getFrameState();
        this.renderer.render(this.stage);
    }

    elapsedSinceLastFrame() {
        let now = Date.now();
        let elapsed = now - this.lastTimeStamp;
        return elapsed;
    }
}

export default Game
