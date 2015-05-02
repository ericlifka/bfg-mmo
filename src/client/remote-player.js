import Entity from './entity';

export default class RemotePlayer extends Entity {
    constructor(game, data) {
        super(game, data);
        this.name = data.name;
        this.moveCommand = null;
    }

    setMoveCommand(moveCommand) {
        this.moveCommand = moveCommand;
    }

    update(timeRatio, inputState) {
        if (this.moveCommand) {
            if (this.moveCommand.isDone) {
                this.moveCommand = null;
            } else {
                this.moveCommand.execute();
            }
        }
    }
}
