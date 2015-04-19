class PlayerCommand {
    constructor(entity) {
        this.entity = entity;
        this.isDone = false;
    }

    execute(timeRatio) {
        this.isDone = true;
    }
}

class PlayerMoveCommand extends PlayerCommand {
    constructor(entity, x, y) {
        super(entity);
        this.target = {x: x, y: y};
    }

    // TODO: Move to a MathUtils?
    static fcmp(f1, f2, tolerance) {
        return ((f1 < f2 + tolerance) && (f1 > f2 - tolerance));
    }

    travelSegment(timeRatio, pos1, pos2) {
        let dx = pos2.x - pos1.x;
        let dy = pos2.y - pos1.y;
        let len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) {
            this.isDone = true;
            return pos2;
        }

        let velocity = this.entity.getVelocity(timeRatio);
        let travel = velocity / len;
        if (travel > 1) {
            travel = 1;
        }

        return {
            x: (pos1.x + (travel * dx)),
            y: (pos1.y + (travel * dy))
        };
    }

    execute(timeRatio) {
        let newPos = this.travelSegment(
                timeRatio, this.entity.position, this.target);

        this.entity.updatePosition(newPos);

        if (PlayerMoveCommand.fcmp(newPos.x, this.target.x, 0.5) &&
                PlayerMoveCommand.fcmp(newPos.y, this.target.y, 0.5)) {
            this.isDone = true;
        }
    }
}

class Player {
    // Things to track (as related to renderable entity):
    //   orientation
    //   world position
    //   current animation (related to orientation/player state)
    // Things to rack (as related to player entity)
    //   player state

    constructor(game, data) {
        this.game = game;
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

    updatePosition(pos) {
        this.position.x = pos.x;
        this.position.y = pos.y;
        this.game.sendEvent({'player-move': this.position});
    }

    update(timeRatio, inputState) {
        // Update
        if (inputState.right || inputState.left ||
                inputState.up || inputState.down) {
            // cancel ongoing move commands
            let velocity = this.getVelocity(timeRatio);
            let newX = this.position.x;
            let newY = this.position.y;
            this.moveCommand = null;
            if (inputState.right) {
                newX = this.position.x + velocity;
            } else if (inputState.left) {
                newX = this.position.x - velocity;
            }

            if (inputState.up) {
                newY = this.position.y - velocity;
            } else if (inputState.down) {
                newY = this.position.y + velocity;
            }
            this.updatePosition({x: newX, y: newY});
        }

        if (inputState.primary) {
            // Issue move command
            let x = inputState.primary.x;
            let y = inputState.primary.y;
            this.moveCommand = new PlayerMoveCommand(this, x, y);
        }

        if (this.moveCommand) {
            this.moveCommand.execute(timeRatio);
            if (this.moveCommand.isDone) {
                this.moveCommand = null;
            }
        }
    }
}

export default Player;
