export default class Game {
    constructor() {

    }

    setEmitter(emitter) {
        this.emitter = emitter;
    }

    processUpdates(player, updates) {
        console.log("client updates: ", player, updates);
    }
}
