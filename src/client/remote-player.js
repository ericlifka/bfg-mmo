import Entity from './entity';

export default class RemotePlayer extends Entity {
    constructor(game, data) {
        super(game, data);
        this.name = data.name;
    }

    update(timeRatio, inputState) {
    }
}
