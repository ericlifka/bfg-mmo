export default class Game {
    constructor() {

    }

    setEmitter(emitter) {
        this.emitter = emitter;
    }

    playerLoggedIn(player) {
        //TODO:
        //  - put player in world
        //  - send player world state
        //  - send player state / info to other players on next tick
    }

    playerLoggedOut(player) {
        //TODO: remove them from world
    }

    processUpdates(player, updates) {
        console.log("client updates: ", player, updates);
    }
}
