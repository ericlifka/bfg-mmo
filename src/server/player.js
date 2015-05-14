export default class Player {
    constructor(name) {
        this.name = name;
        this.updates = {};
        this.loggedIn = false;

        // needs to get set by a chunk before player can interact
        this.chunk = null;
        this.position = null;
    }

    move(position) {
        // TODO: Will need a tryMove that's aware of chunk tiles
        this.position = position;
        // FIXME: Why are so many of these flooding in?
        // console.log(`${this.name}: move ${this.position.x},${this.position.y}`);
        this.updates.position = this.position;
    }

    clearUpdates() {
        this.updates = {};
    }

    serialize() {
        return {
            name: this.name,
            position: this.position,
            image: 'sprites/wizard_girl.png'
        };
    }
}
