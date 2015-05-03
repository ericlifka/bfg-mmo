export default class RenderLoop {

    constructor() {
        this.handlers = [];
        window.frameTimes = this.frameTimes = [];
        this.currentFrame = 0;
        this.runningTotal = 0;
        this.frameRateBufferLength = 60;
        this.frDisplay = createFrameRateDisplay();
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
        if (delay) {
            this.handlers.push({
                immediate: false,
                handler,
                delay,
                elapsed: 0
            });
        } else {
            this.handlers.push({
                immediate: true,
                handler
            });
        }
    }

    frame() {
        const now = Date.now();
        const dTime = now - this.lastTimeStamp;
        this.updateFrameRate(dTime);

        for (let handler of this.handlers) {
            this.invokeHandler(handler, dTime);
        }

        this.lastTimeStamp = now;
    }

    invokeHandler(handler, dTime) {
        if (handler.immediate) {
            handler.handler(dTime);
        }
        else {
            // For non-immediate handlers we add the frame's elapsed time to the total elapsed and
            // check if we've passed the threshold. If we have we invoke the handler and reset the elapsed counter.
            handler.elapsed += dTime;

            if (handler.elapsed >= handler.delay) {
                const elapsed = handler.elapsed;

                // By subtracting the delay we take into account if we overshoot the handler by a large amount,
                // allowing the next trigger to be proportionally sooner. This makes the elapsed trigger time less
                // accurate but keeps the overall clock more 'regular'.
                handler.elapsed -= handler.delay;

                handler.handler(elapsed);
            }
        }
    }

    updateFrameRate(dTime) {
        this.runningTotal -= this.frameTimes[this.currentFrame] || 0;
        this.runningTotal += dTime;
        this.frameTimes[this.currentFrame] = dTime;
        this.currentFrame = (this.currentFrame + 1) % this.frameRateBufferLength;
        const frameRate = this.runningTotal / this.frameTimes.length;
        const fps = ("" + frameRate).substr(0, 4);
        this.frDisplay.innerHTML = `FPS: ${fps}`;
    }
}

function createFrameRateDisplay() {
    const display = document.createElement('div');
    display.className = "frame-rate-display";
    document.body.appendChild(display);
    return display;
}
