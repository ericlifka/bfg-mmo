const getTime = () => (new Date()).getTime();

let tickStart;  // mark the time when a tick starts
let tickEnd;    // mark the time when a tick finishes processing
let lastTick;   // mark the start of the last tick to calculate dTime
let targetStep; // the target delta between the start of each tick

const nextTickOffset = () => targetStep - (tickEnd - tickStart);

const scheduleNextTick = handler => setTimeout(() => {
    tickStart = getTime();
    const dTime = tickStart - lastTick;
    handler(dTime);
    tickEnd = getTime();
    lastTick = tickStart;

    scheduleNextTick(handler);
}, nextTickOffset());

export default {
    run(targetTimeStep, tickHandler) {
        targetStep = targetTimeStep;
        lastTick = tickEnd = tickStart = getTime();

        scheduleNextTick(tickHandler);
    }
};
