import Command from './command';

class PlayerMoveCommand extends Command {
    constructor(entity, pos) {
        super(entity);
        this.target = pos;

        let len = this.getDistance();
        // Travel distance divided by step where step is sterver tick over frame tick... maybe?
        this.velocity = len / (50 / 20);
    }

    getDistance() {
        let pos1 = this.entity.position;
        let pos2 = this.target;
        let dx = pos2.x - pos1.x;
        let dy = pos2.y - pos1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // TODO: Move to a MathUtils?
    static fcmp(f1, f2, tolerance) {
        return ((f1 < f2 + tolerance) && (f1 > f2 - tolerance));
    }

    travelSegment(timeRatio) {
        let pos1 = this.entity.position;
        let pos2 = this.target;
        let dx = pos2.x - pos1.x;
        let dy = pos2.y - pos1.y;
        let len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) {
            this.isDone = true;
            return pos2;
        }
        let travel = this.velocity / len;
        if (travel > 1) {
            travel = 1;
        }

        return {
            x: (pos1.x + (travel * dx)),
            y: (pos1.y + (travel * dy))
        };
    }

    execute(timeRatio) {
        let newPos = this.travelSegment(timeRatio);

        // this.entity.updatePosition(newPos);
        this.entity.position = newPos;

        if (PlayerMoveCommand.fcmp(newPos.x, this.target.x, 0.5) &&
            PlayerMoveCommand.fcmp(newPos.y, this.target.y, 0.5)) {
            this.isDone = true;
        }
    }
}

export default PlayerMoveCommand;
