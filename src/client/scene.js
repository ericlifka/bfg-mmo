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

        let level = this.game.currentLevel;
        for (let tile of level.tiles) {
            let newCoords = this.camera.translateCoordinates(tile.position);
            tile.sprite.x = Math.round(newCoords.x);
            tile.sprite.y = Math.round(newCoords.y);
        }

        for (let entity of this.game.entities) {
            let newCoords = this.camera.translateCoordinates(entity.position);
            entity.sprite.x = Math.round(newCoords.x);
            entity.sprite.y = Math.round(newCoords.y);
        }
    }
}
