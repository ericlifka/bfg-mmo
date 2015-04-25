import Command from './command';

class PlayerMoveCommand extends Command {
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

export default PlayerMoveCommand;
