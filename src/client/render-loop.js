export default class RenderLoop {

    constructor() {
        this.handlers = [];
    }

    start() {
        this.paused = false;

        const browserFrameHook = () => {
            this.frame();

            if (!this.paused) {
                requestAnimationFrame(browserFrameHook);
            }
        };

        this.lastTimeStamp = Date.now();
        requestAnimationFrame(browserFrameHook);
    }

    stop() {
        this.paused = true;
    }

    addFrameHandler(handler, delay = 0) {
        this.handlers.push(handler);
    }

    frame() {
        for (let handler of this.handlers) {
            handler();
        }
    }

}