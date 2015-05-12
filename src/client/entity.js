import Billboard from './billboard';

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
        this.billboard = new Billboard("", {
            font: "normal 16px Arial",
            fill: "white",
            stroke: "black",
            strokeThickness: 2
        });
        this.sprite = new PIXI.Sprite.fromImage(data.image);
    }

    setName(name) {
        this.billboard.setText(name);
    }

    addSprite(container) {
        container.addChild(this.sprite);
        this.billboard.addSprite(container);
    }

    removeSprite(container) {
        container.removeChild(this.sprite);
        this.billboard.removeSprite(container);
    }

    setSpritePosition(screenCoords) {
        this.sprite.x = screenCoords.x;
        this.sprite.y = screenCoords.y;
        this.billboard.setSpritePosition({x: screenCoords.x, y: screenCoords.y - 24});
    }

    getVelocity(timeRatio) {
        return (timeRatio / 1000) * 200;
    }
}
