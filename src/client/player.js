class PlayerCommand {
    constructor(entity) {
        this.entity = entity;
        this.isDone = false;
    }

    execute(timeRatio) {
        this.isDone = true;
    }

    cancel() {
        this.isDone = true;
    }
}

class PlayerMoveCommand extends PlayerCommand {
    constructor(entity, x, y) {
        super(entity);
        this.x = x;
        this.y = y;
    }

    static fcmp(f1, f2, tolerance) {
        return ((f1 < f2 + tolerance) && (f1 > f2 - tolerance));
    }

    execute(timeRatio) {
        // if (this.fcmp(this.entity.position.x, this.x, 0.5)
        //     && this.fcmp(this.entity.position.y, this.y 0.5)) {
        //     this.isDone;
        //     return;
        // } 
    }
}

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

    getVelocity(timeRatio) {
        return (timeRatio / 1000) * 200;
    }

    update(timeRatio, inputState) {
        // Update 
        let velocity = this.getVelocity(timeRatio);
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

        if (inputState.click) {
            // Issue move command
            x = inputState.click.x;
            y = inputState.click.y;
            this.moveCommand = new PlayerMoveCommand(this, x, y);
        }
    }
}

export default Player;
