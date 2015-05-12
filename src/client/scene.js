import Camera from './camera';

export default class Scene {
    constructor(game, width, height) {
        this.game = game;
        this.stage = game.stage;
        this.width = width;
        this.height = height;

        this.trackingEntity = null;
        this.camera = new Camera(width, height);
        this.playerLayer = new PIXI.Container();
        this.mapLayer = new PIXI.Container();
        this.hudLayer = new PIXI.Container();

        this.stage.addChild(this.mapLayer);
        this.stage.addChild(this.playerLayer);
        this.stage.addChild(this.hudLayer);
    }

    setTrackingEntity(entity) {
        this.trackingEntity = entity;
    }

    addEntity(entity) {
        entity.addSprite(this.playerLayer);
    }

    removeEntity(entity) {
        let removed = this.playerLayer.removeChild(entity.sprite);
    }

    addTile(tile) {
        this.mapLayer.addChild(tile.sprite);
    }

    removeTile(tile) {
        this.mapLayer.removeChlid(tile.sprite);
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
            const pos = this.camera.translateCoordinates(entity.position);
            const screenCoords = {
                x: Math.round(pos.x),
                y: Math.round(pos.y)
            };
            entity.setSpritePosition(screenCoords);
        }
    }
}
