class Command {
    constructor(entity) {
        this.entity = entity;
        this.isDone = false;
    }

    execute(timeRatio) {
        this.isDone = true;
    }
}

export default Command;
