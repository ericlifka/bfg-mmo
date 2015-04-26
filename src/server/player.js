export default class Player {
    constructor(name, chunk, position) {
        this.name = name;
        this.chunk = chunk;
        this.position = position;
        this.updates = {};
        this.loggedIn = false;
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
