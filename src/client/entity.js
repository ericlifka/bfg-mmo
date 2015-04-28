export default class Entity {
    constructor(game, data) {
        this.game = game;
        this.connection = game.connection;  // TODO: Is this too janky of a way of accessing the connection?
        this.sprite = null;
        this.position = data.position;
        this.orientation = 0; // TODO: need enumarted cardinal directions

        this.velocity = 1000;

        this.moving = false;
        this.bindSprites(data);
    }

    bindSprites(data) {
        console.log(data.image);
        this.sprite = new PIXI.Sprite.fromImage(data.image);
    }

    getVelocity(timeRatio) {
        return (timeRatio / 1000) * 200;
    }
}
