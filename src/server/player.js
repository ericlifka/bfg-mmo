export default class Player {
    constructor(name, chunk, position) {
        this.name = name;
        this.chunk = chunk;
        this.position = position;
        this.updates = [];
        this.loggedIn = false;
    }

    serialize() {
        return {
            name: this.name,
            position: this.position,
            image: 'sprites/wizard_girl.png'
        };
    }
}
