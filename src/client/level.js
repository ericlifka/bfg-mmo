class Tile {
    constructor(position, type) {
        this.position = position;
        // We would want to have an option for tile frames in order to create
        // an animated tile
        this.sprite = PIXI.Sprite.fromFrame(type);
        this.height = 32;
        this.width = 32;
    }
}

let TILE_TYPES = ['B03', 'F22'];

export default class Level {
    constructor(level_data) {
        // Yeah, level data from the server ideally but for now we're just
        // going to fake a bunch of tiles.
        this.tiles = [];
        // this.generateTiles();
        for (let tileDef of level_data.tiles) {
            this.tiles.push(new Tile(tileDef.position, tileDef.type));
        }
    }
}
