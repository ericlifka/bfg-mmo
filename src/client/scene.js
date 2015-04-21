import Camera from './camera';

export default class Scene {
    constructor(game, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;

        this.trackingEntity = null;
        this.camera = new Camera(width, height);
    }

    setTrackingEntity(entity) {
        this.trackingEntity = entity;
    }

    update() {
        if (this.trackingEntity) {
            this.camera.trackPosition(this.trackingEntity.position);
        }

        for (let entity of this.game.entities) {
            let newCoords = this.camera.translateCoordinates(entity.position);
            entity.sprite.x = Math.round(newCoords.x);
            entity.sprite.y = Math.round(newCoords.y);
        }
    }
}
