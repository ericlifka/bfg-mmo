class Player {
    // Things to track (as related to renderable entity):
    //   orientation
    //   world position
    //   current animation (related to orientation/player state)
    // Things to rack (as related to player entity)
    //   player state

    constructor(data) {
        this.sprite = null;
        this.position =  { x: 100, y: 100 };
        this.orientation = 0; // TODO: need enumarted cardinal directions

        this.velocity = 1000;

        this.moving = false;
        this.bindSprites(data);
    }

    bindSprites(data) {
        this.sprite = new PIXI.Sprite.fromImage(data.image);
    }

    update(timeRatio, inputState) {
        // Update 
        let velocity = 3;
        if (inputState.right) {
            this.position.x += velocity;
        } else if (inputState.left) {
            this.position.x -= velocity;
        }

        if (inputState.up) {
            this.position.y -= velocity;
        } else if (inputState.down) {
            this.position.y += velocity;
        }
    }
}

export default Player;
