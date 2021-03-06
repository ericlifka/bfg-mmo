import Entity from './entity';
import Connection from './connection';
import PlayerMoveCommand from './command/player-move';

export default class Player extends Entity {
    // Things to track (as related to renderable entity):
    //   orientation
    //   world position
    //   current animation (related to orientation/player state)
    // Things to rack (as related to player entity)
    //   player state

    constructor(game, data) {
        super(game, data);
        this.name = data.name;
        this.setName(data.name);
        this.velocity = 1000;
        this.moving = false;
    }

    getVelocity(timeRatio) {
        return (timeRatio / 1000) * 200;
    }

    updatePosition(pos) {
        this.position.x = pos.x;
        this.position.y = pos.y;

        this.connection.sendEvent('player-move', this.position);
    }

    update(timeRatio, inputState) {
        // Update
        if (inputState.right || inputState.left ||
                inputState.up || inputState.down) {
            let velocity = this.getVelocity(timeRatio);
            let newX = this.position.x;
            let newY = this.position.y;

            // cancel ongoing move commands
            this.moveCommand = null;

            if (inputState.right) {
                newX = this.position.x + velocity;
            } else if (inputState.left) {
                newX = this.position.x - velocity;
            }

            if (inputState.up) {
                newY = this.position.y + velocity;
            } else if (inputState.down) {
                newY = this.position.y - velocity;
            }
            this.updatePosition({x: newX, y: newY});
        }

        if (inputState.primary) {
            // Issue move command
            // let x = inputState.primary.x;
            // let y = inputState.primary.y;
            // this.moveCommand = new PlayerMoveCommand(this, x, y);
        }

        if (this.moveCommand) {
            this.moveCommand.execute(timeRatio);
            if (this.moveCommand.isDone) {
                this.moveCommand = null;
            }
        }
    }
}
